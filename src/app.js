const { readFile } = require('fs');
const RequestHandler = require('./frameWork.js');
const app = new RequestHandler();

const logRequests = function(req, res, next) {
	console.log(req.url);
	console.log(req.method);
	next();
};

const addPathPrefix = url => `./public${url}`;

const getPath = function(url) {
	let path = addPathPrefix(url);
	if (url === '/') {
		path = addPathPrefix('/login.html');
	}
	return path;
};

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
	return;
};

const sendNotFound = function(res) {
	return send(res, 404, 'Page Not Found');
};

const serveFile = function(req, res) {
	let path = getPath(req.url);
	readFile(path, (err, content) => {
		if (!err) {
			send(res, 200, content);
			return;
		}
		sendNotFound(res);
		return;
	});
};

const render404Page = function(req, res) {
	fs.readFile('./public/notFound.html', (error, content) => {
		send(res, 404, content);
	});
};

app.use(logRequests);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
