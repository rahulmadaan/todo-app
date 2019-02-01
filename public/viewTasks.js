const addTask = function(listId, userId) {
	fetch(`/addTask?listId='${listId}'&userId='${userId}'`)
		.then(function(res) {
			return res.text();
		})
		.then(function(output) {
			document.getElementById('addNewTask').innerHTML = output;
		});
};

const addTaskInterface = function() {
	fetch('/newTaskForm')
		.then(function(res) {
			return res.text();
		})
		.then(function(output) {
			document.getElementById('addNewTask').innerHTML = output;
			document.getElementById('addNewTaskButton').disabled = true;
			document.getElementById('deleteList').disabled = true;
		});
};

const confirmDeletion = function() {
	fetch('/confirmDeletion')
		.then(function(res) {
			return res.text();
		})
		.then(function(output) {
			document.getElementById('addNewTask').innerHTML = output;
			document.getElementById('addNewTaskButton').disabled = true;
			document.getElementById('deleteList').disabled = true;
		});
};

const clearConfirmationDiv = function() {
	document.getElementById('addNewTask').innerHTML = '';
	document.getElementById('addNewTaskButton').disabled = false;
	document.getElementById('deleteList').disabled = false;
};

const editTask = function(taskId) {
	const previousTaskDetails = document.getElementById(taskId).innerText;
	const parsedTaskDetails = previousTaskDetails.split('\t');
	const taskDescription = parsedTaskDetails[0];
	const taskStatus = parsedTaskDetails[1];
	document.getElementById('taskEditingForm').innerText = taskDescription;
	document.getElementById('hiddenTaskId').value = taskId;
};
