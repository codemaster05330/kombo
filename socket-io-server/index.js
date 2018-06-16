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

var emojis = [false, false, false, false, false, false, false, false, false, false, false, false];

// create metric synth with broadcast function (sending to all connected clients)
const broadcastFunction = (cmd, ...args) => io.emit(cmd, ...args);
const metricSync = new MetricSync(broadcastFunction);

io.on('connection', (socket) => {
	console.log('connected');
	
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

	//recieve and distribute sequence object
	socket.on('new-sequence', (sequence) => {
		console.log("new sequence of type " + sequence.type);
		io.emit('new-sequence', sequence);
	});

	//emoji is being taken
	socket.on('take-emoji', (emojiID) =>{
		console.log("Emoji " + emojiID + " has been taken.");
		emojis[emojiID] = true;
		io.emit('emoji-taken', emojiID);
	});

	//emoji is set free
	socket.on('free-emoji', (emojiID) => {
		console.log("Emoji " + emojiID + " isn't taken anymore.");
		emojis[emojiID] = false;
		io.emit('emoji-untaken', emojiID);
	});

	//return emoji List
	socket.on('get-emojis', () => {
		console.log("Requested Emoji List");
		io.emit('emojis-get', emojis);
	});
});

var port = process.env.PORT || 3001;

http.listen(port, () => {
	console.log('listening in http://localhost:' + port);
});
