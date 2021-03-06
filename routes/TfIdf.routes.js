/*=== Lists CRUD Routes ===*/
var TfIdfCtrl = require("../controllers/TfIdfCtrl");
var CacheCtrl = require("../controllers/CacheCtrl");

var TfIdfRoutes = function(app) {

	app.get("/tfidf/:id", function(req, res) {
		TfIdfCtrl.fetch(req, res);
	});

	app.post("/tfidfs", function(req, res) {
		TfIdfCtrl.createAll(req, res);
	})

	/** DEPRECATED **/
	// app.get("/cache/warmup", function(req, res) {
	// 	CacheCtrl.warmup(req, res);
	// });

}

module.exports = TfIdfRoutes;
