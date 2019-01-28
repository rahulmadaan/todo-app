const { readFile, writeFile } = require('fs');
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
		res.setHeader('Set-Cookie', 'userId=1548394081634');
		next();
		return;
	}
	res.setHeader('Location', '/login.html');
	send(res, 'Wrong user name and password', 302);
};

const getUserIdByCookie = function(cookie) {
	const splittedCookie = cookie.split('=');
	return splittedCookie[1];
};

const createRow = function(contents, listId, userId) {
	return `<a href="/viewTasks.html?listId=${listId}"><div id='${contents}' class='printList'></div><p>${contents}</p></a>`;
};

const parseList = function(cookie, jsonList) {
	const userId = getUserIdByCookie(cookie);
	const listDetails = JSON.parse(jsonList);
	let html = '';
	const requiredList = listDetails[userId];
	const titleList = requiredList.map(list => {
		html += createRow(list.title, list.listId, userId);
	});
	return html;
};

const viewList = function(req, res, next) {
	readFile('./data/listsDetails.json', (err, lists) => {
		let table = parseList(req.headers.cookie, lists);
		send(res, table);
	});
};

const parseListDetails = function(listDetails) {
	const args = {};
	const splittedDetails = listDetails.split('&');
	const mappedDetails = splittedDetails.map(details => details.split('='));
	mappedDetails.map(key => {
		args[key[0]] = key[1];
	});
	return args;
};

const addIdentity = function(listToIdentify) {
	const prefix = 'm_r-';
	const numeric = Date.now();
	const postfix = '-l';
	listToIdentify.listId = prefix + numeric + postfix;
	return listToIdentify;
};
const addNewList = function(req, res, next) {
	const userId = getUserIdByCookie(req.headers.cookie);
	const newListItem = parseListDetails(req.body);
	const enhancedListItem = addIdentity(newListItem);
	readFile('./data/listsDetails.json', (err, lists) => {
		const ourCopy = JSON.parse(lists);
		ourCopy[userId].push(enhancedListItem);
		writeFile('./data/listsDetails.json', JSON.stringify(ourCopy), err => {});
	});
	next();
};

const getTasks = function(req, res) {
	res.write('');
	res.end();
};

app.use(readBody);
app.use(logRequests);

app.post('/dashboard.html', addNewList);

app.get('/viewList', viewList);
// app.post('/dashboard.html', validateUser);

app.get(/\/viewTasks.html\?listId=/, getTasks);

app.use(serveFile);
module.exports = app.handleRequest.bind(app);
