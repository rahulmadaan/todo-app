const getLists = function() {
  fetch("/viewList")
    .then(function(res) {
      return res.text();
    })
    .then(function(out) {
      document.getElementById("listBlock").innerHTML = out;
    });
};

const logout = function() {
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.location = "/";
  console.log(" clearing cookies ");
};

window.onload = getLists;
