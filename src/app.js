const { readFile, writeFile } = require('fs');
const RequestHandler = require('./frameWork.js');
const TASKS_DETAILS_FILE = './data/taskDetails.json';

const app = new RequestHandler();
const logRequests = function(req, res, next) {
	console.log(req.url);
	console.log(req.method);
	next();
};

const template = {
	viewTask: `<html>
	<head>
		<title>Mingle-ViewList</title>
		<link rel="stylesheet" href="main.css" />
		<script src="viewTasks.js"></script>
	</head>
	<body>
		<main>
			<div class="viewListHeader" xz>
				<header>
					<h1><u>Your listName List</u></h1>
					</header>
					<hr />
					</div>
					<div class="toDoLists">
					<table id="userLists">
					<thead>
					<td><strong>List Items</strong><button onclick=confirmDeletion() >&#x1F5D1</button></td>
						</thead>						
						</table>
						<button type="submit" value='addTask' id="addNewTaskButton" onclick = addTaskInterface()> Create new Task</button>
						<div id="addNewTask"></div>
			</div>
		</main>
	</body>
</html>
`,
	newTaskForm: `<form
action="/addNewTask"
method="POST"
style="width:680px;
margin: 0 auto;
text-align:center;"
>
<lable>Task Description:</lable> <br />
<input
	type="text"
	name="taskDescription"
	placeholder="Enter Task description"
	style="width:240px; height:30px;font-size: 20px;border-radius:7.25px"
/>
<input
	type="submit"
	value="Save Task"
	
	style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px"
/>
</form>`,

	confirmDeletion: listId => `<form
	action=/deleteList?listId=${listId};
method="POST"
style="width:680px;
margin: 0 auto;
text-align:center;"
>
<lable>Are you sure to Delete this list?</lable> <br />
<input
	type="submit"
	value="Delete"
	style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px"
/>
</form>`
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
		res.writeHead(302, {
			Location: '/Dashboard.html',
			'Set-Cookie': 'userId=1548394081634'
		});
		next();
		return;
	}
	res.setHeader('Location', '/');
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

const addIdentity = function(listToIdentify, suffix = 'l') {
	const prefix = 'm_r-';
	const numeric = Date.now();
	const postfix = '-' + suffix.slice(0, 1);
	listToIdentify[suffix + 'Id'] = prefix + numeric + postfix;
	return listToIdentify;
};
const getList = function(listItem) {
	const parsedListItem = parseListDetails(listItem);
	const enhancedListItem = addIdentity(parsedListItem, 'list');
	return enhancedListItem;
};

const createInstanceInTaskDetails = function(userId, listId) {
	readFile(TASKS_DETAILS_FILE, 'utf8', (err, contents) => {
		const newInstance = { userId: userId, listId: listId, task: [] };
		const parsedList = JSON.parse(contents);
		parsedList.push(newInstance);
		writeFile('./data/taskDetails.json', JSON.stringify(parsedList), err => {});
	});
};

const addNewList = function(req, res, next) {
	const userId = getUserIdByCookie(req.headers.cookie);
	const list = getList(req.body);
	const listId = list.listId;
	readFile('./data/listsDetails.json', (err, lists) => {
		const ourCopy = JSON.parse(lists);
		ourCopy[userId].push(list);
		writeFile('./data/listsDetails.json', JSON.stringify(ourCopy), err => {});
		createInstanceInTaskDetails(userId, listId);
	});
	next();
};

const extractListId = function(url) {
	return url.split('=')[1];
};

const filterRequiredList = function(
	allTaskLists,
	requiredUserid,
	requiredListId
) {
	const lists = JSON.parse(allTaskLists);
	const requiredList = lists.filter(list => {
		if (list.userId == requiredUserid && list.listId == requiredListId) {
			return list;
		}
	});
	return requiredList[0];
};
const giveStatus = function(statusBoolean) {
	if (statusBoolean === 0) {
		return 'To-Do';
	}
	return 'Done';
};

const createTaskRow = function(description, statusBoolean) {
	let status = giveStatus(statusBoolean);
	return `<tr><td >${description}</td><td>${status}</td></tr>`;
};

const parseTasks = function(requiredList) {
	let html = '<table class = "taskList">';
	listDetails = requiredList.map(list => {
		html += createTaskRow(list.itemDescription, list.status);
	});

	return html;
};

const getTasks = function(req, res) {
	const listId = extractListId(req.url);
	const userId = getUserIdByCookie(req.headers.cookie);
	readFile('./data/taskDetails.json', 'utf8', (err, contents) => {
		const requiredTaskList = filterRequiredList(contents, userId, listId);
		const html = parseTasks(requiredTaskList.task);
		const form = template.viewTask;
		send(res, form + html);
	});
};

const renderNewTaskForm = function(req, res, next) {
	const form = template.newTaskForm;
	send(res, form);
};

const renderConfirmDeletionForm = function(req, res) {
	const listId = extractListId(req.headers.referer);
	const form = template.confirmDeletion(listId);
	send(res, form);
};

const updateTaskList = function(userId, listId, task) {
	readFile(TASKS_DETAILS_FILE, 'utf8', (err, content) => {
		const parsedTaskDetails = JSON.parse(content);
		const filteredTaskDetails = parsedTaskDetails.filter(
			taskList => taskList.listId == listId
		);
		const newTaskItem = { itemDescription: task, status: 0 };
		const newTask = addIdentity(newTaskItem, 'task');
		filteredTaskDetails[0].task.push(newTask);
		writeFile(
			'./data/taskDetails.json',
			JSON.stringify(parsedTaskDetails),
			err => {}
		);
	});
};

const addTaskInList = function(req, res, next) {
	const task = req.body.split('=')[1];
	const userId = getUserIdByCookie(req.headers.cookie);
	const listId = extractListId(req.headers.referer);
	updateTaskList(userId, listId, task);
	res.writeHead(302, {
		location: req.headers.referer
	});
	res.end();
};

const updateListTasks = function(userId, listId) {
	readFile(TASKS_DETAILS_FILE, 'utf8', (err, contents) => {
		const parsedList = JSON.parse(contents);
		const remainingTasks = parsedList.filter(
			list => list['listId'] != listId && userId['userId'] != userId
		);
		writeFile(
			'./data/taskDetails.json',
			JSON.stringify(remainingTasks),
			err => {}
		);
	});
};

const deleteList = function(req, res) {
	const userId = getUserIdByCookie(req.headers.cookie);
	const listId = extractListId(req.headers.referer);
	readFile('./data/listsDetails.json', (err, lists) => {
		const parsedList = JSON.parse(lists);
		const usersToDos = parsedList[userId];
		const remainingToDos = usersToDos.filter(list => list['listId'] != listId);
		parsedList[userId] = remainingToDos;
		writeFile(
			'./data/listsDetails.json',
			JSON.stringify(parsedList),
			err => {}
		);
		updateListTasks(userId, listId);
	});
	res.writeHead(302, {
		location: '/dashboard.html'
	});
	res.end();
};

app.use(readBody);
app.use(logRequests);
app.post('/login', validateUser);
app.post('/dashboard.html', addNewList);
app.get('/viewList', viewList);
app.get(/\/viewTasks.html\?listId=/, getTasks);
app.get('/newTaskForm', renderNewTaskForm);
app.post('/addNewTask', addTaskInList);
app.get('/confirmDeletion', renderConfirmDeletionForm);
app.post(/\/deleteList\?listId=/, deleteList);

app.use(serveFile);
module.exports = app.handleRequest.bind(app);
