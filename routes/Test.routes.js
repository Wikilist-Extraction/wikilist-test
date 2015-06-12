/*=== Lists CRUD Routes ===*/
'use strict';
var TestCtrl = require('../controllers/TestCtrl');

var TfIdfRoutes = function(app) {

	app.get('/test/start/:id', function(req, res) {
		TestCtrl.runAllTests(req, res);
	});

	app.get('/test/result/:id', function(req, res) {
		TestCtrl.getResults(req, res);
	});

};

module.exports = TfIdfRoutes;
