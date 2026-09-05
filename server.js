/*
	server.js
	Joe O'Regan
	30/01/2019
	Antibody - Server
*/
const http = require("node:http");
const express = require("express");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("web"));

const users = new Map();

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on("newuser", (data) => {
		if (!data || typeof data.name !== "string") return;

		const name = data.name.trim();
		if (!name) return;

		users.set(socket.id, name);
		io.emit("update-user-list", [...users.values()]);
	});

	socket.on("updateuser", (data) => {
		if (!data || typeof data.newname !== "string") return;

		const name = data.newname.trim();
		if (!name) return;

		users.set(socket.id, name);
		io.emit("update-user-list", [...users.values()]);
	});

	socket.on("message", (data) => {
		if (!data || typeof data.message !== "string") return;
		socket.broadcast.emit("message", data);
	});

	socket.on("disconnect", () => {
		const name = users.get(socket.id);
		users.delete(socket.id);

		if (name) {
			socket.broadcast.emit("user.events", {
				name: "system",
				message: `${name} has left the game`
			});
		}

		io.emit("update-user-list", [...users.values()]);
	});
});

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});