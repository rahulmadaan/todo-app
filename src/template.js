const templates = {
  viewTask: `<html>
	<head>
		<title>What To-Do App  </title>
		<link rel="stylesheet" href="main.css" />
		<script src="viewTasks.js"></script>
	</head>
	<body>
		<main>
			<div class="viewListHeader">
				<header style="text-align:center">
					<h1><u>Your List  <a href="/dashBoard.html">&#x1F3E0;</a></u></h1>
					</header>
					<hr />
					</div>
					<div class="toDoLists">
					<table id="userLists">
					<thead>
					<td><strong>List Items</strong><button onclick=confirmDeletion() id="deleteList">&#x1F5D1</button></td>
						</thead>						
						</table>
						<button type="submit" value='addTask' id="addNewTaskButton" onclick = addTaskInterface()> Create new Task</button>
						<div id = "main-task">
							<div id="addNewTask"></div>
							<div id = "edit"> </div>
						</div>
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
<button type="button" onclick = "clearConfirmationDiv()" style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px; margin-left:10px;">Cancel</button>
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
<button type="button" onclick = "clearConfirmationDiv()" style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px; margin-left:10px;">Cancel</button>
</form>`,

  taskEditingForm: `<form
	 action="/editTask"
	 method="POST"
style="width:680px;
text-align:center;"
>
<lable>Task Description:</lable> <br />
<hr>
<textArea
	id="taskEditingForm"
	name = "taskDescription"
	required
	style="width:240px; height:30px;font-size: 20px;border-radius:7.25px"
></textArea>
<input
type="hidden"
value=""
name = "taskId"
id="hiddenTaskId"
style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px"
/>
<button type="submit" style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px; margin-left:10px;">Save Changes</button>
<button type="button" style="width:150px; height:30px;font-size: 20px;border-radius: 7.25px; margin-left:10px;">Cancel</button>
</form>`
};
{
  /* <input
	type="text"
	name="taskDescription"
	id="taskEditingForm"
	required
	style="width:240px; height:30px;font-size: 20px;border-radius:7.25px"
/> */
}
module.exports = { templates };
