/*
	Joe O'Regan
	30/01/2019
*/
const http = require('http');
const express = require('express');

var port = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

app.use(express.static('static'));

var users = [];

io.on('connection', (socket) => {
	console.log('New User Connected');

	socket.on('newuser', (data) => {
		socket.username = data.name; // Tag the socket with the name

		if (!users.includes(data.name)) {
			users.push(data.name);
		}

		console.log('User Joined: ' + data.name);
		io.emit('update-user-list', users);
	});

	socket.on('updateuser', (data) => {
		let index = users.indexOf(data.oldname);
		if (index !== -1) {
			users[index] = data.newname;
			socket.username = data.newname; // Update the tag on the socket

			console.log(`User ${data.oldname} renamed to ${data.newname}`);
			io.emit('update-user-list', users);
		}
	});

	socket.on('message', (data) => {
		console.log(data.name, 'says', data.message);
		socket.broadcast.emit('message', data);	// broadcast to everyone except this
	});

	socket.on('disconnect', () => {
		if (socket.username) {
			console.log('User disconnected: ' + socket.username);

			users = users.filter(user => user !== socket.username);

			socket.broadcast.emit('user.events', {
				name: 'system',
				message: `${socket.username} has left the chat!`
			});

			io.emit('update-user-list', users);
		}
	});
});

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
