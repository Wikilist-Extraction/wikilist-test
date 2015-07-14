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
		var testName = req.params.id;
		var testResults = req.body.lists;
		console.log(testResults)
		TestModelCtrl.createTestResultSet(testName, testResults);
		res.json({message: "success"});
	});
};

module.exports = TfIdfRoutes;
