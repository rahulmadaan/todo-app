const  Task  = require('../src/task.js');
const assert = require('assert');
describe('task', () => {
	const toDoTask = new Task('wake up at 5 am', 0, 1234);
	describe('editing task description', () => {
		it('should edit task description', () => {
			toDoTask.editDescription('wake up at 5:30am');
			assert.equal(toDoTask.getDescription(), 'wake up at 5:30am');
		});
	});
	describe('updating status of task', () => {
		it('should change status of task', () => {
			toDoTask.toggleStatus();
			assert.equal(toDoTask.getStatus(), 1);
		});
	});
});
