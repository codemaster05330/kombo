class MetricScheduler {
  constructor(clockSync, broadcastFunction) {
    this._clockSync = clockSync;
    this._broadcastFunction = broadcastFunction;

    this._ref = {
      syncTime: 0,
      metricPosition: 0,
      tempo: 60,
      tempoUnit: 0.25,
    };

    this._nextRef = null;
  }

  configure(options) {
    const ref = this._ref;

    if (options.tempo !== undefined)
      ref.tempo = options.tempo;

    if (options.tempoUnit !== undefined)
      ref.tempoUnit = options.tempoUnit;

    super.configure(options);
  }

  _updateRef() {
    const currentSyncTime = this._clockSync.syncTime;
    const nextRef = this._nextRef;

    if (nextRef && currentSyncTime >= nextRef.syncTime) {
      this._ref = nextRef;
      this._nextRef = null;
    }

    return this._ref;
  }

  _getOnInit(sendFunction) {
    return () => {
      this._updateRef();

      sendFunction('metric-scheduler:init', this._ref);

      if (this._nextRef)
        sendFunction('metric-scheduler:set', this._nextRef);
    };
  }

  start(sendFunction, receiveFunction) {
    receiveFunction('metric-scheduler:init', this._getOnInit(sendFunction));
  }

  set(syncTime, metricPosition, tempo, tempoUnit, event) {
    const currentSyncTime = this._clockSync.syncTime;
    const ref = { syncTime, metricPosition, tempo, tempoUnit, event };

    if (syncTime <= currentSyncTime) {
      this._ref = ref;
      this._nextRef = null;
    } else {
      this._nextRef = ref;
    }

    this._broadcastFunction('metric-scheduler:set', ref);
  }

  setTempo(tempo, tempoUnit, reset = false, delay = 0) {
    const syncTime = this._clockSync.syncTime + delay;
    let metricPosition = 0;

    if (!reset)
      metricPosition = this.getMetricPositionAtSyncTime(syncTime);

    this.set(syncTime, metricPosition, tempo, tempoUnit, 'tempoChange');
  }

  get metricPosition() {
    this._updateRef();

    const ref = this._ref;

    if (ref.tempo > 0) {
      const currentSyncTime = this._clockSync.syncTime;
      const metricSpeed = ref.tempo * ref.tempoUnit / 60;
      return ref.metricPosition + (currentSyncTime - ref.syncTime) * metricSpeed;
    }

    return ref.metricPosition;
  }

  /**
   * Current tempo.
   * @return {Number} - Tempo in BPM.
   */
  get tempo() {
    this._updateRef();
    return this._ref.tempo;
  }

  /**
   * Current tempo unit.
   * @return {Number} - Tempo unit in respect to whole note.
   */
  get tempoUnit() {
    this._updateRef();
    return this._ref.tempoUnit;
  }

  /**
   * Get metric position corrsponding to a given sync time (regarding the current tempo).
   * @param  {Number} time - time
   * @return {Number} - metric position
   */
  getMetricPositionAtSyncTime(syncTime) {
    this._updateRef();

    const ref = this._ref;

    if (ref.tempo > 0) {
      const metricSpeed = ref.tempo * ref.tempoUnit / 60;
      return ref.metricPosition + (syncTime - ref.syncTime) * metricSpeed;
    }

    return ref.metricPosition;
  }

  /**
   * Get sync time corrsponding to a given metric position (regarding the current tempo).
   * @param  {Number} position - metric position
   * @return {Number} - time
   */
  getSyncTimeAtMetricPosition(metricPosition) {
    this._updateRef();

    const ref = this._ref;
    const metricSpeed = ref.tempo * ref.tempoUnit / 60;

    if (metricPosition < Infinity && metricSpeed > 0) {
      return ref.syncTime + (metricPosition - ref.metricPosition) / metricSpeed;
    }

    return Infinity;
  }
}

module.exports = MetricScheduler;
