/*=== Lists CRUD Routes ===*/
'use strict';
var TestCtrl = require('../controllers/TestCtrl');
var TestModelCtrl = require('../controllers/TestModelCtrl.js');

var TfIdfRoutes = function(app) {

	app.get('/test/start/:id', function(req, res) {
		TestCtrl.runAllTests(req, res);
	});

	app.get('/tests', function(req, res) {
		TestCtrl.getTestIds(req, res);
	});

	app.get('/test/result/:id', function(req, res) {
		TestCtrl.getResults(req, res);
	});

	app.post('/test/result/:id', function(req, res) {
		TestModelCtrl.createTestResultSet(req, res);
	});

	app.get('/test/results/:id', function(req, res) {
		TestCtrl.getAllResults(req, res);
	});

};

module.exports = TfIdfRoutes;
