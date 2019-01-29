const addTask = function(listId,userId) {
	fetch(`/addTask?listId='${listId}'&userId='${userId}'`)
		.then(function(res) {
			return res.text();
		})
		.then(function(output) {
			document.getElementById('addNewTask').innerHTML = output;
		});
};

const addTaskInterface = function(){
	fetch('/newTaskForm')
		.then(function(res) {
			return res.text();
		})
		.then(function(output) {
			document.getElementById("addNewTask").innerHTML = output;
			document.getElementById("addNewTaskButton").disabled = true;
		});
};

const confirmDeletion = function(){
	fetch('/confirmDeletion')
	.then(function(res) {
		return res.text();
	})
	.then(function(output) {
		document.getElementById("addNewTask").innerHTML = output;
		document.getElementById("addNewTaskButton").disabled = true;
	});


}
