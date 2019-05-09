const Task = require("./task");
const ToDo = require("./toDo");

const { extractFirstElement } = require("./util.js");
class User {
  constructor(userName, password, id, toDos = []) {
    this.userName = userName;
    this.password = password;
    this.id = id;
    this.toDos = toDos;
  }
  static parse(userDetails) {
    const { userName, password, id, toDos } = userDetails;
    const parsedToDos = toDos.map(toDo => ToDo.parse(toDo));
    return new User(userName, password, id, parsedToDos);
  }

  getRequestedToDo(todoId) {
    const requestedToDo = this.toDos.filter(todo => todo.id == todoId);
    return extractFirstElement(requestedToDo);
  }

  getToDos() {
    return this.toDos;
  }
  createToDo(title, description, id) {
    const newToDo = new ToDo(title, description, id);
    this.toDos.push(newToDo);
  }
  deleteToDo(toDoId) {
    const updatedToDo = this.getToDos().filter(toDo => toDo.id != toDoId);
    this.toDos = updatedToDo;
  }
  addToDoItem(toDoId, description, status, id) {
    const requiredTodo = this.getRequestedToDo(toDoId);
    requiredTodo.addTask(description, id, status);
  }
  editItemDescription(todoId, taskId, updatedDescription) {
    const allTodos = this.toDos;
    const requiredTodo = extractFirstElement(
      allTodos.filter(todo => todo.id == todoId)
    );
    requiredTodo.editTaskDescription(taskId, updatedDescription);
    this.toDos = allTodos;
  }
}

module.exports = User;
