class Task {
  constructor(description, status, id) {
    this.description = description;
    this.status = status;
    this.id = id;
  }
  static parse(taskDetails) {
    const { description, status, id } = taskDetails;
    return new Task(description, status, id);
  }
  getDescription() {
    return this.description;
  }
  getStatus() {
    return this.status;
  }
  editDescription(newDescription) {
    this.description = newDescription;
  }
  toggleStatus() {
    this.status = 1 - this.status;
  }
}
module.exports = Task;
