/*
	server.js
	Joe O'Regan
	21/05/2022
	Antibody - Server
*/
const express = require('express');
// socketio = require('socket.io');

const port = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);
const os = require('os');
// const dns = require('dns');

console.log("Antibody JS by Joe O'Regan");

// let addr=dns.lookup(os.hostname(), function(err,add,fam){
// 	console.log("Server running on " +add+":"+ port);
// });

// console.log("Server runnning on http://localhost:3000");


console.log("Platform: " + os.platform() + " Architecture: " + os.arch() + " Hostname: " + os.hostname());


// scores json
// sychronous
// const fs = require('fs');
// let rawdata = fs.readFileSync('static/scores.json');
// let scores = JSON.parse(rawdata);
// console.log(scores);

// promise-based / asynchronous
// const fs = require('fs/promises');
// fs.readFile('static/scores.json')
// .then((data) => {
// 	console.log(JSON.parse(data));
// })
// .catch((error) => {
// 	console.log(error);
// });


app.use(express.static('static'));

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
