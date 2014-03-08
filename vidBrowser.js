var shoe = require('shoe');
var through = require('through');

var stream = shoe('/con');

window.setTimeout(function () { console.clear(); }, 1e3);

var listener = function (e) {
	if (e.which === 8) { e.preventDefault(); }
	var data = {
		type: e.type,
		keyIdentifier: e.keyIdentifier,
		which: e.which,
		shift: e.shiftKey,
		charCode: e.charCode,
		ctrl: e.ctrlKey,
		meta: e.metaKey,
		repeat: e.repeat,
		alt: e.altKey
	};
	stream.write(JSON.stringify(data));
};

document.addEventListener('keydown', listener);
document.addEventListener('keypress', listener);

stream.pipe(through(function (msg) {
	console.log(msg);
}));

