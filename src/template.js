const templates = {
	viewTask: `<html>
	<head>
		<title>Mingle-ViewList</title>
		<link rel="stylesheet" href="main.css" />
		<script src="viewTasks.js"></script>
	</head>
	<body>
		<main>
			<div class="viewListHeader" xz>
				<header>
					<h1><u>Your listName List</u></h1>
					</header>
					<hr />
					</div>
					<div class="toDoLists">
					<table id="userLists">
					<thead>
					<td><strong>List Items</strong><button onclick=confirmDeletion() >&#x1F5D1</button></td>
						</thead>						
						</table>
						<button type="submit" value='addTask' id="addNewTaskButton" onclick = addTaskInterface()> Create new Task</button>
						<div id="addNewTask"></div>
			</div>
		</main>
	</body>
</html>
`,
	newTaskForm: `<form
action="/addNewTask"
method="POST"
style="width:680px;
margin: 0 auto;
text-align:center;"
>
<lable>Task Description:</lable> <br />
<input
	type="text"
	name="taskDescription"
	placeholder="Enter Task description"
	required
	style="width:240px; height:30px;font-size: 20px;border-radius:7.25px"
/>
<input
	type="submit"
	value="Save Task"
	
	style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px"
/>
</form>`,

	confirmDeletion: listId => `<form
	action=/deleteList?listId=${listId};
method="POST"
style="width:680px;
margin: 0 auto;
text-align:center;"
>
<lable>Are you sure to Delete this list?</lable> <br />
<input
	type="submit"
	value="Delete"
	style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px"
/>
</form>`
};

module.exports = { templates };
