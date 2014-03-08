var http = require('http');
var fs = require('fs');
var shoe = require('shoe');
var through = require('through');

var foot = http.createServer(function (request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var html = fs.readFileSync('./template.html');
	response.end(html);
});

require("dronestream").listen(foot);

var arDrone = require('ar-drone');

var keyMap = {
	8: 'disableEmergency', // delete
	37: 'counterClockwise', // <-
	39: 'clockwise',  // ->
	38: 'up',  // ^
	40: 'down', // v
	87: 'front', // W
	119: 'front', // w
	83: 'back',  // S
	115: 'back',  // s
	65: 'left', // A
	119: 'left', // a
	91: 'right', // D
	68: 'right', // d
	32: 'stop', // [ ]
	27: 'land', // esc
	13: 'takeoff' // enter
};

foot.listen(8000);
var sock = shoe(function (stream) {
	var client = arDrone.createClient();
	stream.pipe(through(function (msg) {
		var e = JSON.parse(msg);
		var cmd = keyMap[e.which];
		var log = (cmd ? cmd + (e.repeat ? ' (repeat)' : '')  : 'Unknown: ' + e.which + ' / ' + e.keyIdentifier) + ' : Battery: ' + client.battery();
		if (cmd === 'takeoff' || cmd === 'land') {
			client[cmd](function () {
				console.log(cmd + ' completed');
			});
		} else if (cmd === 'disableEmergency') {
			client[cmd]();
		} else if (client[cmd]) {
			client[cmd](0.1 * (e.repeat ? 3 : 1));
		}
		console.log(log);
		stream.write(log);
	})).pipe(stream);
});
sock.install(foot, '/con');

