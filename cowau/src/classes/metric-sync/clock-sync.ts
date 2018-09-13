import * as audio from 'waves-audio';

const audioContext = audio.audioContext;

export class ClockSync {
	_resolveStartPromise:any;
	_resolveRestartPromise:any;
	_listeners:any;
	_errorListeners:any;

	_doublePingInterval:number;
	_minPingPeriod:number;
	_maxPingPeriod:number;
	_pingCount:number;

	_maxTravelDuration:number;
	_syncTolerance:number;
	_evenPingClientTime:number;
	_evenPingServerTime:number;
	_evenPingTravelDuration:number;
	_evenPingCount:number;

	_sync:boolean;
	_pingCountAtSync:number;
	_syncServerTime:any;
	_syncClientTime:any;

	_sendFunction:any;

	_timeoutId:any;

	constructor() {
		this._resolveStartPromise = null;
		this._resolveRestartPromise = null;
		this._listeners = new Set();
		this._errorListeners = new Set();

		this._doublePingInterval = 0.020;
		this._minPingPeriod = 1;
		this._maxPingPeriod = 4;
		this._pingCount = 0;

		this._maxTravelDuration = 0.020;
		this._syncTolerance = 0.020;

		this._evenPingClientTime = undefined;
		this._evenPingServerTime = undefined;
		this._evenPingTravelDuration = undefined;

		this._sync = false;
		this._pingCountAtSync = undefined;
		this._syncServerTime = undefined;
		this._syncClientTime = undefined;

		this._timeoutId = null;

		this._pingLoop = this._pingLoop.bind(this);
		this._onPong = this._onPong.bind(this);
	}

	_pingLoop() {
		const time = audioContext.currentTime;
		this._sendFunction('clock-sync:ping', this._pingCount, time);

		let interval;

		if ((this._pingCount & 1) === 0)
			interval = this._doublePingInterval;
		else
			interval = (this._sync) ? this._maxPingPeriod : this._minPingPeriod;

		this._timeoutId = setTimeout(this._pingLoop, 1000 * interval);

		this._pingCount++;
	}

	_onPong(pingCount, pingTime, serverTime) {
		const time = audioContext.currentTime;
		const travelDuration = time - pingTime;
		const clientTime = pingTime + 0.5 * travelDuration;
		let error = null;

		if ((pingCount & 1) === 0) {
			this._evenPingClientTime = time;
			this._evenPingServerTime = serverTime;
			this._evenPingTravelDuration = travelDuration;
			this._evenPingCount = pingCount;
		} else if (pingCount === this._evenPingCount + 1) {
			const clientInter = time - this._evenPingClientTime;
			const serverInter = serverTime - this._evenPingServerTime;
			const interDiff = Math.abs(serverInter - clientInter);
			const interDiffOk = (interDiff <= this._syncTolerance);
			const travelDurationsOk = (this._evenPingTravelDuration <= this._maxTravelDuration &&
				travelDuration <= this._maxTravelDuration);

			if (interDiffOk && travelDurationsOk) {
				this._syncClientTime = 0.5 * (clientTime + this._evenPingClientTime);
				this._syncServerTime = 0.5 * (serverTime + this._evenPingServerTime);
				this._pingCountAtSync = pingCount;

				// BUG: Auskommentiert damit es nicht mehr "Unused" ist.
				const offset = 0.5 * (this._syncServerTime - this._syncClientTime);
				// console.log(`${(pingCount - 1) / 2}: sync! (offset: ${offset})`);

				this._callListeners();

				if (this._resolveStartPromise) {
					this._resolveStartPromise();
					this._resolveStartPromise = null;
				}

				if (this._resolveRestartPromise) {
					this._resolveRestartPromise();
					this._resolveRestartPromise = null;
				}

				this._sync = true;
			} else if (this._pingCountAtSync !== undefined) {
				// console.log(`${(pingCount - 1) / 2}: failed to sync (since ${(this._pingCountAtSync - 1) / 2})`);

				if (!travelDurationsOk) {
					error = 'travel';
					// console.log(`   travel durations: ${this._evenPingTravelDuration}, ${travelDuration}`);
				}

				if (!interDiffOk){
					error = 'diff';
					// console.log(`   inter ping difference: ${interDiff}`);
				}

				this._sync = false;
			}
		} else {
			error = 'diff';
			this._sync = false;
			console.log(`${(pingCount - 1) / 2}: cannot sync (ping count confusion)`);
		}

		if (error !== null) {
			const errorDuration = time - this._syncClientTime;
			this._callErrorListeners(error, errorDuration);
		}
	}

	start(sendFunction, receiveFunction) {
		const promise = new Promise((resolve, reject) => {
			this._resolveStartPromise = resolve;
			this._sendFunction = sendFunction;

			receiveFunction('clock-sync:pong', this._onPong);

			this._pingLoop();
		});

		return promise;
	}

	stop() {
		if (this._timeoutId !== null)
			clearTimeout(this._timeoutId);
	}

	restart() {
		const promise = new Promise((resolve, reject) => {
			this.stop();

			this._resolveRestartPromise = resolve;
			this._pingCount = 0;
			this._sync = false;

			this._pingLoop();
		});

		return promise;
	}

	get syncTime() {
		const time = audioContext.currentTime;
		return this._syncServerTime + time - this._syncClientTime;
	}

	getSyncTimeAtAudioTime(audioTime) {
		return this._syncServerTime + audioTime - this._syncClientTime;
	}

	getAudioTimeAtSyncTime(syncTime) {
		return this._syncClientTime + (syncTime - this._syncServerTime);
	}

	addListener(listener, error = false) {
		if (!error)
			this._listeners.add(listener);
		else
			this._errorListeners.add(listener);
	}

	removeListener(listener) {
		this._listeners.delete(listener);
		this._errorListeners.delete(listener);
	}

	_callListeners() {
		for (let listener of this._listeners)
			listener();
	}

	_callErrorListeners(error, errorDuration) {
		for (let listener of this._errorListeners)
			listener(error, errorDuration);
	}
}
