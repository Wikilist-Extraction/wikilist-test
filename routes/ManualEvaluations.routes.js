/*=== ManualEvaluation CRUD Routes ===*/
var ManualEvaluationsCtrl = require("../controllers/ManualEvaluationsCtrl");

var ManualEvaluationsRoutes = function(app) {

	app.post("/evaluation", function(req, res) {
		ManualEvaluationsCtrl.create(req, res);
	});

	app.get("/evaluation", function(req, res) {
		ManualEvaluationsCtrl.fetchAll(req, res);
	});

	app.get("/evaluation/:id", function(req, res) { //try findById
		ManualEvaluationsCtrl.fetch(req, res);
	});

	app.put("/evaluation/:id", function(req, res) {
		ManualEvaluationsCtrl.update(req, res);
	});

	app.delete("/evaluation/:id", function(req, res) {
		ManualEvaluationsCtrl.delete(req, res);
	});

}

module.exports = ManualEvaluationsRoutes;
