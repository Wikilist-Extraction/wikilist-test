/*=== Lists CRUD Routes ===*/
var TfIdfCtrl = require("../controllers/TfIdfCtrl");

var TfIdfRoutes = function(app) {

	app.get("/tfidf/:id", function(req, res) { //try findById
		TfIdfCtrl.fetch(req, res);
	});

}

module.exports = TfIdfRoutes;
