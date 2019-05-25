const { writeFile, readFileSync } = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const { USERS_DETAILS_FILE, DEFAULT_TASK_STATUS } = require("./constants.js");

const { templates } = require("./template");
const { logRequests, serveFile, readBody } = require("./handler");
const { send } = require("./handlersUtility.js");
const ToDo = require("./toDo.js");
const User = require("./user.js");
const {
  toString,
  getUserIdByCookie,
  extractFirstElement
} = require("./util.js");

const usersDetails = JSON.parse(readFileSync(USERS_DETAILS_FILE, "utf8"));

const userIds = Object.keys(usersDetails);
userIds.map(user => {
  usersDetails[user] = User.parse(usersDetails[user]);
});

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

const isDetailsMatching = function(username, password) {
  if (usersDetails[username]) {
    return usersDetails[username].password === password;
  }
  return false;
};

const validateUser = function(req, res, next) {
  const { username, password } = req.body;
  if (isDetailsMatching(username, password)) {
    res.cookie("userId", username);
    res.redirect("/dashboard.html");
    next();
    return;
  }
  res.redirect("/");
  res.send("Wrong username and password");
};

const createRow = function(toDoTitle, listId, toDoDescription) {
  return `<a href="/viewTasks.html?listId=${listId}"><div id='${toDoTitle}'
 class='printList'>${toDoDescription}</div><p>${toDoTitle}</p></a>`;
};

const createTable = function(allToDos) {
  let html = "";
  allToDos.map(toDo => {
    html += createRow(toDo.title, toDo.id, toDo.description);
  });
  return html;
};

const viewList = function(req, res) {
  const userId = req.cookies.userId;
  const currentUser = usersDetails[userId];
  let table = createTable(currentUser.toDos);
  res.send(table);
};

const generateNumericCode = function() {
  const randomNumber = Math.random() * 10000000;
  return Math.floor(randomNumber);
};

const generateId = function(entity) {
  const idPrefix = "w_t_d-";
  const numberCode = generateNumericCode();
  const suffix = entity.slice(0, 1);
  return idPrefix + numberCode + suffix;
};

const getList = function(userInput) {
  const { title, description } = userInput;
  const id = generateId("TD");
  return { title, description, id };
};

const addNewList = function(req, res, next) {
  const userId = getUserIdByCookie(req.headers.cookie);
  const { title, description, id } = getList(req.body);
  const currentUser = usersDetails[userId];
  currentUser.createToDo(title, description, id);
  writer(USERS_DETAILS_FILE, toString(usersDetails));
  res.redirect("./dashboard.html");
  next();
};

const extractListId = function(url) {
  return url.split("=")[1];
};

const giveStatus = function(statusBoolean) {
  if (statusBoolean === 0) {
    return "UnDone";
  }
  return "Done";
};

const createTaskRow = function(description, statusBoolean, taskId) {
  let status = giveStatus(statusBoolean);
  return `<tr id="${taskId}" onclick=editTask('${taskId}')><td >${description}</td><td>${status}</td></tr>`;
};

const parseTasks = function(requiredList) {
  let html = '<table class = "taskList">';
  requiredList.map(task => {
    html += createTaskRow(task.description, task.status, task.id);
  });

  return html;
};

const getRequestedEntity = function(entityList, requestedEntityId) {
  const requestedEntity = entityList.filter(
    toDo => toDo.id == requestedEntityId
  );
  return extractFirstElement(requestedEntity);
};

const getTasks = function(req, res) {
  const { userId, listId } = extractToDoDetails(req.headers.cookie, req.url);
  const contents = getRequestedEntity(usersDetails[userId].toDos, listId);
  const html = parseTasks(contents.tasks);
  const form = templates.viewTask + templates.taskEditingForm;
  res.send(form + html);
};

const renderNewTaskForm = function(req, res) {
  const form = templates.newTaskForm;
  res.send(form);
};

const renderConfirmDeletionForm = function(req, res) {
  const listId = extractListId(req.headers.referer);
  const form = templates.confirmDeletion(listId);
  res.send(form);
};

const updateTaskList = function(userId, listId, taskDescription) {
  const taskId = generateId("task");
  usersDetails[userId].addToDoItem(
    listId,
    taskDescription,
    DEFAULT_TASK_STATUS,
    taskId
  );
  writer(USERS_DETAILS_FILE, toString(usersDetails));
};

const addTaskInList = function(req, res, next) {
  const { listId } = extractToDoDetails(
    req.headers.cookie,
    req.headers.referer
  );
  const { userId } = req.cookies;
  const task = req.body.taskDescription;

  updateTaskList(userId, listId, task);
  res.redirect(req.headers.referer);
  res.end();
};

const deleteList = function(req, res) {
  const { userId, listId } = extractToDoDetails(
    req.headers.cookie,
    req.headers.referer
  );
  const currentUser = usersDetails[userId];
  currentUser.deleteToDo(listId);
  writer(USERS_DETAILS_FILE, toString(usersDetails));
  res.redirect("./dashboard.html");
  res.end();
};

const editTaskDescription = function(req, res) {
  const { userId, listId } = extractToDoDetails(
    req.headers.cookie,
    req.headers.referer
  );
  const { taskDescription, taskId } = req.body;
  const userTodos = usersDetails[userId];
  userTodos.editItemDescription(listId, taskId, taskDescription);
  res.redirect(req.headers.referer);
  writer(USERS_DETAILS_FILE, toString(usersDetails));
  res.end();
};

const addNewUser = function(req, res) {
  const { name, username, password } = req.body;
  usersDetails[name] = {
    userName: name,
    password,
    id: username,
    toDos: []
  };
  writer(USERS_DETAILS_FILE, toString(usersDetails));
  res.redirect("/");
  res.end();
};
app.use(logRequests);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(cookieParser());

app.post("/login", validateUser);
app.post("/signup", addNewUser);
app.post("/dashboard.html", addNewList);
app.get("/viewList", viewList);
app.get("/confirmDeletion", renderConfirmDeletionForm);
app.post(/\/deleteList/, deleteList);

app.get(/\/viewTasks.html?/, getTasks);
app.get("/newTaskForm", renderNewTaskForm);
app.post("/addNewTask", addTaskInList);
app.post("/editTask", editTaskDescription);

app.use(express.static("./public"));

module.exports = app;
