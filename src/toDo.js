const Task = require('./task');

class ToDo{
  constructor(title,description,id,tasks=[]){
    this.title = title;
    this.description = description;
    this.id = id;
    this.tasks = tasks;
  }
  static parse(toDoDetails){
    const {title,description,id,tasks}=toDoDetails;
    const toDoTasks = tasks.map(task=>Task.parse(task))
    return new ToDo(title,description,id,toDoTasks);
  }
  addTask(newTaskDescription,status,id){
    const latestTask = new Task(newTaskDescription,status,id);
    this.tasks.push(latestTask);
  }
  getTitle(){
    return this.title;
  }
  getDescription(){
    return this.description;
  }
  getTasks(){
    return this.tasks;
  }
  setTasks(newTaskList){
    this.tasks = newTaskList;
  }
  deleteTask(taskId){
    const updatedTasks = this.getTasks().filter(task => task.id!=taskId);
    this.setTasks(updatedTasks);
  }
}

module.exports = ToDo ;