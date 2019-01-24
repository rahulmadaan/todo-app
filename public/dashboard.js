const viewList = function() {
	fetch('/viewList')
		.then(function(response) {
			return response.text();
		})
		.catch(function(err) {
			if (err) throw err;
		});
};
