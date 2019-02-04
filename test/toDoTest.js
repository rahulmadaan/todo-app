const ToDo = require("../src/toDo.js");
const Task = require("../src/task.js");
const assert = require("assert");

describe("task", () => {
  const usersToDo = new ToDo(
    "daily routine",
    "my day to day life routine i have to follow",
    "w_t_d-263676356751-TD"
  );
  usersToDo.addTask("brush teeth at 6:45am", 0, "w_t_d-2636763564681-T");
  describe("add new task in todo", () => {
    it("should add new task in the task list", () => {
      const expectedTask = new Task(
        "brush teeth at 6:45am",
        0,
        "w_t_d-2636763564681-T"
      );
      assert.deepEqual(usersToDo.getTasks(), [expectedTask]);
    });
  });
  describe("deleting task", () => {
    it("should deleting the task of given id", () => {
      usersToDo.addTask("leave pg at 7:45am", 0, "w_t_d-2636763564692-T");
      usersToDo.deleteTask("w_t_d-2636763564681-T");
      const expectedTask = new Task(
        "leave pg at 7:45am",
        0,
        "w_t_d-2636763564692-T"
      );
      assert.deepEqual(usersToDo.getTasks(), [expectedTask]);
    });
  });
  describe("get Title of to-do", () => {
    it("should get title", () => {
      const actualTitle = usersToDo.getTitle();
      const expectedTitle = "daily routine";
      assert.equal(actualTitle, expectedTitle);
    });
  });
  describe("get description of to-do", () => {
    it("should give the description of the to-do", () => {
      const actualDescription = usersToDo.getDescription();
      const expectedDescription = "my day to day life routine i have to follow";
      assert.equal(actualDescription, expectedDescription);
    });
  });
  describe("get tasks of to-do", () => {
    it("should return the task list of particular to-do", () => {
      const actualTasks = usersToDo.getTasks();
      const expectedTasks = [
        new Task("leave pg at 7:45am", 0, "w_t_d-2636763564692-T")
      ];
      assert.deepEqual(actualTasks, expectedTasks);
    });
  });
  describe("setting new task list", () => {
    it("should change the task list of particular to do", () => {
      usersToDo.setTasks([
        new Task("take a  break at 11:00 am", 0, "w_t_d-2636763564681-T")
      ]);
      const expectedTasks = [
        new Task("take a  break at 11:00 am", 0, "w_t_d-2636763564681-T")
      ];
      assert.deepEqual(usersToDo.getTasks(), expectedTasks);
    });
  });
});
