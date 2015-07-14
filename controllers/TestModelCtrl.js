/*=== TestModel Controller ===*/
'use strict';

var _ = require('lodash');
var sync = require('synchronize');
var TestModel = require('../models/TestModel');

var TestModelCtrl = {
	NO_TEST_ID: {
    status: 'error',
    message: 'Provide a test id as part of the url.'
  },

	NO_RESULT_LISTS: {
		status: 'error',
		message: 'Provide a `lists` key in the body, which holds a map of list ids to calculated wiki types'
	},

	SUCCESSFULLY_SAVED: {
		status: 'ok',
		message: 'The lists have been stored.'
	},


	existsTest : function(testId) {
		var lists = sync.await( TestModel.find({ testId: testId }, sync.defer()) );
		return lists.length > 0;
	},

	existsTestResult : function(testId, testResult) {
		return TestModelCtrl.existsTest(testId) &&
		 TestModelCtrl.fetchTest(testId).lists[testResult.list] !== null;
	},

	createEmptyTest : function(testId) {
		var testModel = new TestModel({
			testId: testId,
			lists: {}
		});

		return sync.await( testModel.save(sync.defer()) );
	},

	/** DEPRECATED **/
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

	fetchTestIds : function() {
		var allTests = sync.await( TestModel.find( sync.defer() ));

		return _.map(allTests, function(test) { return test.testId; });
	},

	/** DEPRECATED **/
	updateTestResult : function (testId, testResult) {
		var lists = TestModelCtrl.fetchTest(testId).lists;
		lists[testResult.listId] = testResult.result;

		return sync.await( TestModel.update({ testId: testId }, { $set: { lists: lists } }, sync.defer()) );
	},


	createTestResultSet : function(req, res) {
		var testId = req.params.id;
		var pushedLists = req.body.lists;

		if (!testId) {
			res.json(TestModelCtrl.NO_TEST_ID);
			return;
		}

		if (!pushedLists || !_.isObject(pushedLists)) {
			res.json(TestModelCtrl.NO_RESULT_LISTS);
			return;
		}

		var testModel, lists;

		// create a new test model or fetch an existing one
		if (!TestModelCtrl.existsTest(testId)) {
			testModel = TestModelCtrl.createEmptyTest(testId);
			lists = {};
		} else {
			testModel = TestModelCtrl.fetchTest(testId);
			lists = testModel.lists;
		}

		// if a list does not exist yet
		// create a version container
		for (var listId in pushedLists) {
			if (!_.has(lists, listId)) {
				lists[listId] = []; // empty version container
			}
		}

		// add new lists to each version container
		testModel.lists = _(lists)
			.mapValues(function(versions, listId) {
				if (_.has(pushedLists, listId)) {
					return versions.concat([ pushedLists[listId] ]);
				}

				return versions;
			})
			.value();

		sync.await( testModel.save(sync.defer()) );
		res.json(TestModelCtrl.SUCCESSFULLY_SAVED);
	}
};

module.exports = TestModelCtrl;
