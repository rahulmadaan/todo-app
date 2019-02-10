const Task = require("./task");
const ToDo = require("./toDo");
const { getFirstElement } = require("./util.js");
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
    return getFirstElement(requestedToDo);
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
    this.setTasks(updatedToDo);
  }
  addToDoItem(toDoId, description, status, id) {
    const requiredTodo = this.getRequestedToDo(toDoId);
    requiredTodo.addTask(description, status, id);
  }
}

module.exports = User;
