/*=== Lists CRUD Routes ===*/
var ListsCtrl = require("../controllers/ListsCtrl");

var ListsRoutes = function(app) {

	app.get("/lists", function(req, res) {
		ListsCtrl.fetchAll(req, res);
	});

	app.get("/lists/status", function(req, res) {
		ListsCtrl.fetchAllWithStatus(req, res);
	});
}

module.exports = ListsRoutes;
