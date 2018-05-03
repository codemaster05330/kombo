import { Injectable } from '@angular/core';

import { ServerClockSync } from '../classes/sync-service/server.clock-sync';
import { ServerMetricScheduler } from '../classes/sync-service/server.metric-scheduler';

// broadcast to all connected clients
//   broadcastFunction = (cmd, ...args) => { };
// 
// e.g. for soundworks
//   broadcastFunction = (cmd, ...args) => this.broadcast(null, null, cmd, ...args);

@Injectable()
export class ServerMetricSync {
	_clockSync:ServerClockSync;
	_metricScheduler:ServerMetricScheduler;

	constructor(broadcastFunction) {
		this._clockSync = new ServerClockSync();
		// this._clockSync = clockSync;

		this._metricScheduler = new ServerMetricScheduler(this._clockSync, broadcastFunction);
	}

	// client specific send and receive functions
	//   sendFunction = (cmd, ...args) => { };
	//   receiveFunction = (cmd, callback) => { };
	// 
	// ... e.g. for soundworks
	//   sendFunction = (cmd, ...args) => this.send(client, cmd, ...args);
	//   receiveFunction = (cmd, callback) => this.receive(client, cmd, callback);

	start(sendFunction, receiveFunction) {
		this._clockSync.start(sendFunction, receiveFunction);
		this._metricScheduler.start(sendFunction, receiveFunction);
	}

	setTempo(tempo, tempoUnit, reset = false, delay = 0) {
		this._metricScheduler.setTempo(tempo, tempoUnit, reset, delay);
	}

	get syncTime() {
		return this._clockSync.syncTime;
	}

	get metricPosition() {
		return this._metricScheduler.metricPosition;
	}

	get tempo() {
		return this._metricScheduler.tempo;
	}

	get tempoUnit() {
		return this._metricScheduler.tempoUnit;
	}
}