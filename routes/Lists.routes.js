/*=== Lists CRUD Routes ===*/
var ListsCtrl = require("../controllers/ListsCtrl");

var ListsRoutes = function(app) {

	app.post("/lists", function(req, res) {
		ListsCtrl.create(req, res);
	});

	app.get("/lists", function(req, res) {
		ListsCtrl.fetchAll(req, res);
	});

	app.get("/lists/:id", function(req, res) { //try findById
		ListsCtrl.fetch(req, res);
	});

	app.put("/lists/:id", function(req, res) {
		ListsCtrl.update(req, res);
	});

	app.delete("/lists/:id", function(req, res) {
		ListsCtrl.delete(req, res);
	});

}

module.exports = ListsRoutes;
