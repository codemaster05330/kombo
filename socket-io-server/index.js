const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MetricSync = require('./metric-sync/');

const clients = new Set(); // set of connected clients

// client data structure (may be helpful one day)
class Client {
	constructor(socket) {
		this.socket = socket;
		clients.add(this);
	}

	disconnect() {
		clients.delete(this);
	}
}

// create metric synth with broadcast function (sending to all connected clients)
const broadcastFunction = (cmd, ...args) => io.emit(cmd, ...args);
const metricSync = new MetricSync(broadcastFunction);

io.on('connection', (socket) => {
	const client = new Client(socket);

	socket.on('disconnect', () => {
		client.disconnect();
	});

	// start metric sync with send and receive functions
  const sendFunction = (cmd, ...args) => socket.emit(cmd, ...args);
  const receiveFunction = (cmd, callback) => socket.on(cmd, callback);
  metricSync.start(sendFunction, receiveFunction);

  // anwser to client request
	socket.on('request', () => {
		io.emit('acknowledge');
	});
});

var port = process.env.PORT || 3001;

http.listen(port, () => {
	console.log('listening in http://localhost:' + port);
});
