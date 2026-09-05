/*
	server.js
	Joe O'Regan
	21/05/2022
	Antibody - Server
*/
const express = require('express');
const os = require('os');

const port = process.env.PORT || 3000;
const app = express();

console.log("Antibody JS by Joe O'Regan");
console.log(`Platform: ${os.platform()} | Architecture: ${os.arch()} | Hostname: ${os.hostname()}`);

app.use(express.static('web'));

const server = require('http').createServer(app);

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});