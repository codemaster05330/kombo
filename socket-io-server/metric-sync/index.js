const ClockSync = require('./ClockSync');
const MetricScheduler = require('./MetricScheduler');

// broadcast to all connected clients
//   broadcastFunction = (cmd, ...args) => { };
// 
// e.g. for soundworks
//   broadcastFunction = (cmd, ...args) => this.broadcast(null, null, cmd, ...args);

class MetricSync {
  constructor(broadcastFunction) {
    const clockSync = new ClockSync();
    this._clockSync = clockSync;

    this._metricScheduler = new MetricScheduler(clockSync, broadcastFunction);
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

module.exports = MetricSync;