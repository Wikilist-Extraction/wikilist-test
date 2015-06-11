'use strict';

var _ = require('lodash');
var TestRepository = require('./TestRepository');
var ListsCtrl = require('../controllers/ListsCtrl');
var TestModelCtrl = require('../controllers/TestModelCtrl');

var TEST_NOT_FOUND = function(testId) { return "The test for "+testId+" does not exist."; };

function TestSuite(testId) {
  if (!_.contains(TestRepository.getAllTestIds(), testId)) {
    throw new Error(TEST_NOT_FOUND(testId));
  }

  this.testId = testId;
  this.TestCase = TestRepository.getTestCaseById(testId);
}

TestSuite.prototype = {
  test: function(listId) {
    var resources = ListsCtrl.getResourceById(listId);
    var testCase = new this.TestCase(resources);
    return testCase.run();
  },

  runTestFor: function(listId) {
    console.log('Run current test for', listId);

    return {
      listId: listId,
      result: this.test(listId)
    };
  },

  saveTest: function(testResult) {
    if (TestModelCtrl.existsTest(this.testId, testResult)) {
      console.log("update test result");
      TestModelCtrl.updateTestResult(this.testId, testResult);
    } else {
      TestModelCtrl.createTestResult(this.testId, testResult);
    }
  },

  runTests: function() {
    return _(ListsCtrl.getListNamesWithStatus())
      .filter(function(list) { return list.validated; })
      .pluck('listId')
      .map(this.runTestFor, this)
      .each(this.saveTest, this)
      .value();
  }
};

module.exports = TestSuite;
