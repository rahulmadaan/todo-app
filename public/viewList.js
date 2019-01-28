const getLists = function() {
	fetch('/viewList')
		.then(function(res) {
			return res.text();
		})
		.then(function(out) {
			document.getElementById('printList').innerHTML = out;
		});
};

const initializer = function() {
	getLists();
};

window.onload = initializer;
