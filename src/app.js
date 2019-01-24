const { readFile } = require('fs');
const RequestHandler = require('./frameWork.js');
const app = new RequestHandler();
const logRequests = function(req, res, next) {
	console.log(req.url);
	console.log(req.method);
	next();
};

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

const addPathPrefix = url => `./public${url}`;

const getPath = function(url) {
	let path = addPathPrefix(url);
	if (url === '/') {
		path = addPathPrefix('/login.html');
	}
	return path;
};

const send = function(res, content, statusCode = 200) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
	return;
};

const sendNotFound = function(res) {
	return send(res, 'Page Not Found', 404);
};

const serveFile = function(req, res) {
	let path = getPath(req.url);
	readFile(path, (err, content) => {
		if (!err) {
			send(res, content);
			return;
		}
		sendNotFound(res);
		return;
	});
};

const render404Page = function(req, res) {
	fs.readFile('./public/notFound.html', (error, content) => {
		send(res, content, 404);
	});
};

const parseUserDetails = function(userDetails) {
	const args = {};
	const splittedDetails = userDetails.split('&');
	const mappedDetails = splittedDetails.map(details => details.split('='));
	mappedDetails.map(key => {
		args[key[0]] = key[1];
	});
	return args;
};

const isDetailsMatching = function(userDetails) {
	const userName = userDetails.username;
	const password = userDetails.password;
	return (userName == 'rahul') & (password == 1234);
};

const validateUser = function(req, res, next) {
	const userDetails = parseUserDetails(req.body);
	if (isDetailsMatching(userDetails)) {
		next();
		return;
	}
	res.setHeader('Location', '/login.html');
	send(res, 'Wrong user name and password', 302);
};

const viewList = function(req, res, next) {
	send(res, 'you are on view list page');
	next();
};

app.use(readBody);
app.use(logRequests);
app.post('/dashboard.html', validateUser);
app.use(serveFile);
module.exports = app.handleRequest.bind(app);
