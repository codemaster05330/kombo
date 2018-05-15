let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {

	socket.on('disconnect', () => {
		io.emit('users-changed', {user: socket.nickname, event: 'left'});
	});

	socket.on('set-nickname', (nickname) => {
		socket.nickname = nickname;
		console.log(socket.nickname + 'joined chat');
		io.emit('users-changed', {user: nickname, event: 'joined'});
	});

	socket.on('add-message', (message) => {
		io.emit('message', { text: message.text, from: socket.nickname, created: new Date() });
	})
});

var port = process.env.PORT || 3001;

http.listen(port, () => {
	console.log('listening in http://localhost:' + port);
});