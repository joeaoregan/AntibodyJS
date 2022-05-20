/*
	server.js
	Joe O'Regan
	21/05/2022
	Antibody - Server
*/
const express = require('express');
socketio = require('socket.io');

const port = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);
const os = require('os');
const dns = require('dns');

console.log("Antibody JS by Joe O'Regan");

let addr=dns.lookup(os.hostname(), function(err,add,fam){
	console.log("Server running on " +add+":"+ port);
});


console.log("Platform: " + os.platform() + " Architecture: " + os.arch() + " Hostname: " + os.hostname());

app.use(express.static('static'));

server.listen(port);