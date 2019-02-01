const { writeFile, readFileSync } = require('fs');
const RequestHandler = require('./frameWork.js');
const { TASKS_DETAILS_FILE, LISTS_DETAILS_FILE } = require('./constants.js');
const { templates } = require('./template');
const app = new RequestHandler();
const { logRequests, serveFile, readBody } = require('./handler');
const { send } = require('./handlersUtility.js');
const { Task } = require('./task.js');

const allToDosTasks = JSON.parse(readFileSync(TASKS_DETAILS_FILE, 'utf8'));
const usersToDos = JSON.parse(readFileSync('./data/listsDetails.json', 'utf8'));

const writer = function(FILE_PATH, CONTENTS) {
	writeFile(FILE_PATH, CONTENTS, err => {
		if (err) throw err;
	});
};

const extractToDoDetails = function(userIdSource, listIdSource) {
	const userId = getUserIdByCookie(userIdSource);
	const listId = extractListId(listIdSource);
	return { userId, listId };
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
	send(res, 'Wrong username and password', 302);
};

const getUserIdByCookie = function(cookie) {
	const splittedCookie = cookie.split('=');
	return splittedCookie[1];
};

const createRow = function(contents, listId, userId) {
	return `<a href="/viewTasks.html?listId=${listId}"><div id='${contents}'
 class='printList'></div><p>${contents}</p></a>`;
};

const parseList = function(cookie, listDetails) {
	const userId = getUserIdByCookie(cookie);
	let html = '';
	const requiredList = listDetails[userId];
	requiredList.map(list => {
		html += createRow(list.title, list.listId, userId);
	});
	return html;
};

const viewList = function(req, res, next) {
	const toDos = usersToDos;
	let table = parseList(req.headers.cookie, toDos);
	send(res, table);
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
	const newInstance = { userId: userId, listId: listId, task: [] };
	const allTasks = allToDosTasks;
	allTasks.unshift(newInstance);
	writer(TASKS_DETAILS_FILE, JSON.stringify(allTasks));
};

const addNewList = function(req, res, next) {
	const userId = getUserIdByCookie(req.headers.cookie);
	const list = getList(req.body);
	const listId = list.listId;
	const existingTodos = usersToDos; // think for a good name
	existingTodos[userId].push(list);
	writer(LISTS_DETAILS_FILE, JSON.stringify(existingTodos));
	createInstanceInTaskDetails(userId, listId);
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
	const requiredList = allTaskLists.filter(list => {
		if (list.userId == requiredUserid && list.listId == requiredListId) {
			return list;
		}
	});
	return requiredList[0];
};

const giveStatus = function(statusBoolean) {
	if (statusBoolean === 0) {
		return 'UnDone';
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
	const contents = allToDosTasks;
	const { userId, listId } = extractToDoDetails(req.headers.cookie, req.url);
	const requiredTaskList = filterRequiredList(contents, userId, listId);
	const html = parseTasks(requiredTaskList.task);
	const form = templates.viewTask;
	send(res, form + html);
};

const renderNewTaskForm = function(req, res, next) {
	const form = templates.newTaskForm;
	send(res, form);
};

const renderConfirmDeletionForm = function(req, res) {
	const listId = extractListId(req.headers.referer);
	const form = templates.confirmDeletion(listId);
	send(res, form);
};

const updateTaskList = function(userId, listId, task) {
	const parsedTaskDetails = allToDosTasks;
	const filteredTaskDetails = parsedTaskDetails.filter(
		taskList => taskList.listId == listId
	);
	const newTaskItem = { itemDescription: task, status: 0 };
	const newTask = addIdentity(newTaskItem, 'task');
	filteredTaskDetails[0].task.unshift(newTask);
	writer(TASKS_DETAILS_FILE, JSON.stringify(parsedTaskDetails));
};

const addTaskInList = function(req, res, next) {
	const { userId, listId } = extractToDoDetails(
		req.headers.cookie,
		req.headers.referer
	);
	const task = req.body.split('=')[1];
	updateTaskList(userId, listId, task);
	res.writeHead(302, {
		location: req.headers.referer
	});
	res.end();
};

const removeDeletedListTasks = function(userId, listId) {
	const parsedList = allToDosTasks;
	const remainingTasks = parsedList.filter(
		list => list['listId'] != listId && userId['userId'] != userId
	);
	writer(TASKS_DETAILS_FILE, JSON.stringify(remainingTasks));
};

const deleteList = function(req, res) {
	const { userId, listId } = extractToDoDetails(
		req.headers.cookie,
		req.headers.referer
	);
	const allUsersToDos = usersToDos;
	const currentUserToDos = allUsersToDos[userId];
	const remainingToDos = currentUserToDos.filter(
		list => list['listId'] != listId
	);
	allUsersToDos[userId] = remainingToDos;
	writer(LISTS_DETAILS_FILE, JSON.stringify(allUsersToDos));
	removeDeletedListTasks(userId, listId);
	res.writeHead(302, {
		location: '/dashboard.html'
	});
	res.end();
};

const formatContent = function(req, res, next) {
	const content = decodeURIComponent(req.body);
	req.body = content.replace(/['+']/g, ' ');
	next();
};

app.use(readBody);
app.use(formatContent);
app.use(logRequests);

app.post('/login', validateUser);

app.post('/dashboard.html', addNewList);
app.get('/viewList', viewList);
app.get('/confirmDeletion', renderConfirmDeletionForm);
app.post(/\/deleteList\?listId=/, deleteList);

app.get(/\/viewTasks.html\?listId=/, getTasks);
app.get('/newTaskForm', renderNewTaskForm);
app.post('/addNewTask', addTaskInList);

app.use(serveFile);

module.exports = app.handleRequest.bind(app);
