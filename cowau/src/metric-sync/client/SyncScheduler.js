import * as audio from 'waves-audio';

const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

class SyncTimeSchedulingQueue extends audio.SchedulingQueue {
	constructor(clockSync) {
		super();

		this._clockSync = clockSync;
		this._nextSyncTime = Infinity;

		audioScheduler.add(this, Infinity);

		// call this._resync in sync callback
		this._resync = this._resync.bind(this);
		this._clockSync.addListener(this._resync);
	}

	get currentTime() {
		return this._clockSync.getSyncTimeAtAudioTime(audioScheduler.currentTime);
	}

	advanceTime(audioTime) {
		const nextSyncTime = super.advanceTime(this._nextSyncTime);
		const nextAudioTime = this._clockSync.getAudioTimeAtSyncTime(nextSyncTime);

		this._nextSyncTime = nextSyncTime;

		return nextAudioTime;
	}

	resetTime(syncTime) {
		if (syncTime === undefined)
			syncTime = this._clockSync.syncTime;

		this._nextSyncTime = syncTime;

		const audioTime = this._clockSync.getAudioTimeAtSyncTime(syncTime);
		this.master.resetEngineTime(this, audioTime);
	}

	_resync() {
		if (this._nextSyncTime !== Infinity) {
			const nextAudioTime = this._clockSync.getAudioTimeAtSyncTime(this._nextSyncTime);
			this.master.resetEngineTime(this, nextAudioTime);
		} else {
			this.master.resetEngineTime(this, Infinity);
		}
	}
}

class SyncScheduler {
	/** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
	constructor(clockSync) {
		this._clockSync = clockSync;
		this._syncedQueue = null;
	}

	start() {
		this._syncedQueue = new SyncTimeSchedulingQueue(this._clockSync);
	}

	/**
	 * Current sync time of the scheduler (alias `this.syncTime`).
	 * @instance
	 * @type {Number}
	 */
	get syncTime() {
		return this._syncedQueue.currentTime;
	}

	/**
	 * Call a function at a given time.
	 *
	 * @param {Function} fun - Function to be deferred.
	 * @param {Number} time - The time at which the function should be executed.
	 * @param {Boolean} [lookahead=false] - Defines whether the function is called
	 *  anticipated (e.g. for audio events) or precisely at the given time (default).
	 */
	defer(fun, time, lookahead = false) {
		const scheduler = this._syncedQueue;
		const self = this;
		let engine;

		if (lookahead) {
			scheduler.defer(fun, time);
		} else {
			engine = {
				advanceTime: function(time) {
					const delta = self.deltaTime;

					if (delta > 0)
						setTimeout(fun, 1000 * delta, time); // bridge scheduler lookahead with timeout
					else
						fun(time);
				},
			};

			scheduler.add(engine, time); // add without checks
		}
	}

	/**
	 * Add a time engine to the queue.
	 *
	 * @param {Function} engine - Engine to schedule.
	 * @param {Number} time - The time at which the function should be executed.
	 */
	add(engine, time) {
		this._syncedQueue.add(engine, time);
	}

	/**
	 * Remove the given engine from the queue.
	 *
	 * @param {Function} engine - Engine to remove from the scheduler.
	 */
	remove(engine) {
		this._syncedQueue.remove(engine);
	}

	/**
	 * Remove all scheduled functions and time engines from the scheduler.
	 */
	clear() {
		this._syncedQueue.clear();
	}
}

export default SyncScheduler;