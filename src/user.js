const Task = require("./task");
const ToDo = require("./toDo");

class User {
  constructor(userName, password, id, toDos = []) {
    this.userName = userName;
    this.password = password;
    this.id = id;
    this.toDos = toDos;
  }
  static parse(userDetails) {
    const { userName, password, id, toDos } = userDetails;
    const toDos = toDos.map(toDo => ToDo.parse(toDo));
    return new ToDo(userName, password, id, toDos);
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
}

module.exports = User;
