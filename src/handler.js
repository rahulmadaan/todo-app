const { readFile } = require('fs');
const { send, sendNotFound, getPath } = require('./handlersUtility.js');

const readBody = function(req, res, next) {
	let text = '';
	req.on('data', chunk => {
		text = text + chunk;
	});
	req.on('end', () => {
		req.body = text;
		next();
	});
};

const logRequests = function(req, res, next) {
	console.log(req.url);
	console.log(req.method);
	next();
};

const serveFile = function(req, res, next) {
	let path = getPath(req.url);
	readFile(path, (err, content) => {
		if (!err) {
			send(res, content);
			next();
			return;
		}
		sendNotFound(res);
		return;
	});
};

module.exports = { logRequests, serveFile, readBody };
