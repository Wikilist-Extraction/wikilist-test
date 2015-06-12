/*=== TestModel Controller ===*/
'use strict';

var sync = require('synchronize');
var TestModel = require('../models/TestModel');

var TestModelCtrl = {
	existsTest : function(testId) {
		var lists = sync.await( TestModel.find({ testId: testId }, sync.defer()) );
		return lists.length > 0;
	},

	existsTestResult : function(testId, testResult) {
		return TestModelCtrl.existsTest(testId) &&
		 TestModelCtrl.fetchTest(testId).lists[testResult.list] !== null;
	},

	createTestResult : function(testId, testResults) {
		var resultForList = {};
		resultForList[testResults.listId] = testResults.result;

		var testModel = new TestModel({
			testId: testId,
			lists: resultForList
		});

		return sync.await( testModel.save(sync.defer()) );
	},

	fetchTest : function(testId) {
		return sync.await( TestModel.findOne({ testId: testId }, sync.defer()) );
	},

	updateTestResult : function (testId, testResult) {
		var lists = TestModelCtrl.fetchTest(testId).lists;
		lists[testResult.listId] = testResult.result;

		return sync.await( TestModel.update({ testId: testId }, { $set: { lists: lists } }, sync.defer()) );
	}
};

module.exports = TestModelCtrl;
