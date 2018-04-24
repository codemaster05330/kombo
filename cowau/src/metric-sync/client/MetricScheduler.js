import * as audio from 'waves-audio';

const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();
const EPSILON = 1e-12;

class SyncSchedulerHook extends audio.TimeEngine {
  constructor(syncScheduler, metricScheduler) {
    super();

    this._nextPosition = Infinity;
    this._nextTime = Infinity;

    this._syncScheduler = syncScheduler;
    this._metricScheduler = metricScheduler;

    syncScheduler.add(this, Infinity); // add hook to sync (master) scheduler
  }

  advanceTime(syncTime) {
    const metricScheduler = this._metricScheduler;
    const nextPosition = metricScheduler.advancePosition(syncTime, this._nextPosition, metricScheduler._metricSpeed);
    const nextTime = metricScheduler.getSyncTimeAtMetricPosition(nextPosition);

    this._nextPosition = nextPosition;
    this._nextTime = nextTime;

    return nextTime;
  }

  reschedule() {
    const metricScheduler = this._metricScheduler;
    const nextPosition = metricScheduler._engineQueue.time;
    const syncTime = metricScheduler.getSyncTimeAtMetricPosition(nextPosition);

    if (syncTime !== this._nextTime) {
      this._nextPosition = nextPosition;
      this._nextTime = syncTime;

      this.resetTime(syncTime);
    }
  }
}

class NextRefEngine extends audio.TimeEngine {
  constructor(syncScheduler, metricScheduler) {
    super();

    this._syncScheduler = syncScheduler;
    this._metricScheduler = metricScheduler;
    this._ref = null;

    syncScheduler.add(this, Infinity);
  }

  advanceTime(syncTime) {
    this._metricScheduler._applyRef(this._ref);
    return Infinity;
  }

  set(ref) {
    this._ref = ref;
    this.resetTime(ref.syncTime);
  }

  reset(syncTime, metricPosition, tempo, tempoUnit, event) {
    this._ref = null;
    this.resetTime(Infinity);
  }
}

class BeatEngine extends audio.TimeEngine {
  constructor(metro) {
    super();

    this._metro = metro;
    audioScheduler.add(this, Infinity);
  }

  // generate next beat
  advanceTime(audioTime) {
    const metro = this._metro;

    const cont = metro.callback(metro.measureCount, metro.beatCount);
    metro.beatCount++;

    if (cont === undefined || cont === true) {
      if (metro.beatCount >= metro.numBeats)
        return Infinity;

      return audioTime + metro.beatPeriod;
    }

    metro.resetPosition(Infinity);
    return Infinity;
  }

  destroy() {
    this._metro = null;

    if (this.master)
      this.master.remove(this);
  }
}

class MetronomeEngine extends audio.TimeEngine {
  constructor(startPosition, numBeats, beatLength, startOnBeat, callback) {
    super();

    this.startPosition = startPosition;
    this.numBeats = numBeats;
    this.beatLength = beatLength;
    this.startOnBeat = startOnBeat;
    this.callback = callback;

    this.measureLength = numBeats * beatLength;
    this.beatPeriod = 0;
    this.measureCount = 0;
    this.beatCount = 0;

    if (numBeats > 1)
      this.beatEngine = new BeatEngine(this);
  }

  // return position of next measure
  syncSpeed(syncTime, metricPosition, metricSpeed) {
    if (metricSpeed <= 0 && this.beatEngine)
      this.beatEngine.resetTime(Infinity);
  }

  // return position of next measure
  syncPosition(syncTime, metricPosition, metricSpeed) {
    const startPosition = this.startPosition;

    if (this.beatEngine)
      this.beatEngine.resetTime(Infinity);

    // since we are anyway a little in advance, make sure that we don't skip
    // the start point due to rounding errors
    metricPosition -= EPSILON;

    this.beatPeriod = this.beatLength / metricSpeed;
    this.beatCount = 0;

    if (metricPosition >= startPosition) {
      const relativePosition = metricPosition - startPosition;
      const floatMeasures = relativePosition / this.measureLength;
      let measureCount = Math.floor(floatMeasures);
      const measurePhase = floatMeasures - measureCount;

      if (this.beatEngine && this.startOnBeat) {
        const floatBeats = this.numBeats * measurePhase;
        const nextBeatCount = Math.ceil(floatBeats) % this.numBeats;

        this.beatCount = nextBeatCount; // next beat

        if (nextBeatCount !== 0) {
          const audioTime = audioScheduler.currentTime;
          const nextBeatDelay = (nextBeatCount - floatBeats) * this.beatPeriod;
          this.beatEngine.resetTime(audioTime + nextBeatDelay);
        }
      }

      if (measurePhase > 0)
        measureCount++;

      this.measureCount = measureCount - 1;

      return startPosition + measureCount * this.measureLength;
    }

    this.measureCount = 0;
    return startPosition;
  }

  // generate next measure
  advancePosition(syncTime, metricPosition, metricSpeed) {
    const audioTime = audioScheduler.currentTime;

    this.measureCount++;

    // whether metronome continues (default is true)
    const cont = this.callback(this.measureCount, 0);

    this.beatCount = 1;

    if (cont === undefined || cont === true) {
      if (this.beatEngine)
        this.beatEngine.resetTime(audioTime + this.beatPeriod);

      return metricPosition + this.measureLength;
    }

    if (this.beatEngine)
      this.beatEngine.resetTime(Infinity);

    return Infinity;
  }

  destroy() {
    if (this.beatEngine)
      this.beatEngine.destroy();

    if (this.master)
      this.master.remove(this);
  }
}

class MetricScheduler {
  constructor(sync, syncScheduler) {
    this._clockSync = sync;
    this._syncScheduler = syncScheduler;

    this._engineQueue = new audio.PriorityQueue();
    this._engineSet = new Set();
    this._metronomeEngineMap = new Map();

    this._ref = {
      syncTime: 0,
      metricPosition: 0,
      tempo: 0,
      tempoUnit: 0,
    };

    this._metricSpeed = 0.25; // whole notes per second

    this._syncSchedulerHook = null;
    this._nextRefEngine = null;

    this._listeners = new Map();
    this._callingEventListeners = false;
    this._promiseResolve = null;

    this._onInit = this._onInit.bind(this);
    this._onSet = this._onSet.bind(this);
    this._onClear = this._onClear.bind(this);
  }

  _onInit(ref) {
    this._applyRef(ref);
    this._promiseResolve();
  }

  _onSet(ref) {
    this.setRef(ref);
  }

  _onClear() {
    this.clear();
  }

  start(sendFunction, receiveFunction) {
    const promise = new Promise((resolve, reject) => {
      this._syncSchedulerHook = new SyncSchedulerHook(this._syncScheduler, this);
      this._nextRefEngine = new NextRefEngine(this._syncScheduler, this);
      this._promiseResolve = resolve;

      sendFunction('metric-scheduler:init');
      receiveFunction('metric-scheduler:init', this._onInit);
      receiveFunction('metric-scheduler:set', this._onSet);
      receiveFunction('metric-scheduler:clear', this._onClear);
    });

    return promise;
  }

  advancePosition(syncTime, metricPosition, metricSpeed) {
    const engine = this._engineQueue.head;
    const nextEnginePosition = engine.advancePosition(syncTime, metricPosition, metricSpeed);

    if (nextEnginePosition === undefined)
      this._engineSet.delete(engine);

    return this._engineQueue.move(engine, nextEnginePosition);
  }

  _callEventListeners() {
    const listeners = this._listeners.get(event);

    if (listeners) {
      this._callingEventListeners = true;

      const ref = this._ref;

      for (let callback of listeners)
        callback(ref.event, ref);

      this._callingEventListeners = false;
    }
  }

  _rescheduleMetricEngines() {
    const syncTime = this._syncScheduler.syncTime;
    const metricPosition = this.getMetricPositionAtSyncTime(syncTime);

    this._engineQueue.clear();

    const metricSpeed = this._metricSpeed;

    if (metricSpeed > 0) {
      // position engines
      const queue = this._engineQueue;

      for (let engine of this._engineSet) {
        const nextEnginePosition = engine.syncPosition(syncTime, metricPosition, metricSpeed);
        queue.insert(engine, nextEnginePosition);
      }
    } 
    else {
      // stop engines
      for (let engine of this._engineSet) {
        if (engine.syncSpeed)
          engine.syncSpeed(syncTime, metricPosition, 0);
      }
    }

    this._syncSchedulerHook.reschedule();
  }

  _clearEngines() {
    this._engineQueue.clear();
    this._engineSet.clear();

    for (let [key, engine] of this._metronomeEngineMap)
      engine.destroy();

    this._metronomeEngineMap.clear();
    this._syncSchedulerHook.reschedule();
  }

  _applyRef(ref) {
    this._ref = ref;
    this._metricSpeed = ref.tempo * ref.tempoUnit / 60;

    if (ref.event)
      this._callEventListeners();

    this._rescheduleMetricEngines();
  }

  initRef() {
    this._applyRef(ref);
  }

  setRef(ref) {
    const syncTime = this._syncScheduler.syncTime;

    this._nextRefEngine.reset();

    if (ref.syncTime > syncTime)
      this._nextRefEngine.set(ref);
    else
      this._applyRef(ref);
  }

  get metricPosition() {
    const ref = this._ref;

    if (ref.tempo > 0) {
      const syncTime = this._syncScheduler.syncTime;
      return ref.metricPosition + (syncTime - ref.syncTime) * this._metricSpeed;
    }

    return ref.metricPosition;
  }

  /**
   * Get metric position corrsponding to a given sync time (regarding the current tempo).
   * @param  {Number} time - time
   * @return {Number} - metric position
   */
  getMetricPositionAtSyncTime(syncTime) {
    const ref = this._ref;

    if (ref.tempo > 0)
      return ref.metricPosition + (syncTime - ref.syncTime) * this._metricSpeed;

    return ref.metricPosition;
  }

  /**
   * Get sync time corresponding to a given metric position (regarding the current tempo).
   * @param  {Number} position - metric position
   * @return {Number} - sync time
   */
  getSyncTimeAtMetricPosition(metricPosition) {
    const metricSpeed = this._metricSpeed;

    if (metricPosition < Infinity && metricSpeed > 0) {
      const ref = this._ref;
      return ref.syncTime + (metricPosition - ref.metricPosition) / metricSpeed;
    }

    return Infinity;
  }

  /**
   * Current tempo.
   * @return {Number} - Tempo in BPM.
   */
  get tempo() {
    return this._ref.tempo;
  }

  /**
   * Current tempo unit.
   * @return {Number} - Tempo unit in respect to whole note.
   */
  get tempoUnit() {
    return this._ref.tempoUnit;
  }

  addEventListener(event, callback) {
    let listeners = this._listeners.get(event);

    if (!listeners) {
      listeners = new Set();
      this._listeners.set(event, listeners);
    }

    listeners.add(callback);
  }

  removeEventListener(callback) {
    let listeners = this._listeners.get(event);

    if (listeners)
      listeners.remove(callback);
  }

  add(engine, startPosition = this.metricPosition) {
    this._engineSet.add(engine);

    const metricPosition = Math.max(startPosition, this.metricPosition);

    // schedule engine
    if (!this._callingEventListeners && this._metricSpeed > 0) {
      const syncTime = this._syncScheduler.syncTime;
      const nextEnginePosition = engine.syncPosition(syncTime, metricPosition, this._metricSpeed);

      this._engineQueue.insert(engine, nextEnginePosition);
      this._syncSchedulerHook.reschedule();
    }
  }

  remove(engine) {
    const syncTime = this._syncScheduler.syncTime;
    const metricPosition = this.getMetricPositionAtSyncTime(syncTime);

    // stop engine
    if (engine.syncSpeed)
      engine.syncSpeed(syncTime, metricPosition, 0);

    if (this._engineSet.delete(engine) && !this._callingEventListeners && this._metricSpeed > 0) {
      this._engineQueue.remove(engine);
      this._syncSchedulerHook.reschedule();
    }
  }

  /**
   * Add a periodic callback starting at a given metric position.
   * @param {Function} callback - callback function (cycle, beat)
   * @param {Integer} numBeats - number of beats (time signature numerator)
   * @param {Number} metricDiv - metric division of whole note (time signature denominator)
   * @param {Number} tempoScale - linear tempo scale factor (in respect to master tempo)
   * @param {Integer} startPosition - metric start position of the beat
   */
  addMetronome(callback, numBeats = 4, metricDiv = 4, tempoScale = 1, startPosition = 0, startOnBeat = false) {
    const beatLength = 1 / (metricDiv * tempoScale);
    const engine = new MetronomeEngine(startPosition, numBeats, beatLength, startOnBeat, callback);

    this._metronomeEngineMap.set(callback, engine);
    this.add(engine, startPosition);
  }

  /**
   * Remove periodic callback.
   * @param {Function} callback callback function
   */
  removeMetronome(callback /*, endPosition */ ) {
    const engine = this._metronomeEngineMap.get(callback);

    if (engine) {
      this._metronomeEngineMap.delete(callback);
      this.remove(engine);
    }
  }

  clear() {
    this._nextRefEngine.reset();
    this._clearEngines();
  }
}

export default MetricScheduler;