'use strict';

var _ = require('lodash');
var ListsCtrl = require('./ListsCtrl');
var ManualEvaluationsCtrl = require('./ManualEvaluationsCtrl');
var TestModelCtrl = require('./TestModelCtrl');
var TestSuite = require('../tests/TestSuite');
var TestRepository = require('../tests/TestRepository');

var testsRunning = false;


var TestCtrl = {
  START_TESTSUITE_RESPONSE: function(testId, listCount) {
    return {
      status: 'in_progress',
      message: 'Test suite for '+testId+' is running with '+listCount+' lists.'
    };
  },

  TESTSUITE_RUNNING_RESPONSE: function(testId) {
    return {
      status: 'in_progress',
      message: 'The test suite for '+testId+' is already running.'
    };
  },

  TESTSUITE_NOT_FOUND_RESPONSE: function(testId) {
    return {
      status: 'not_found',
      message: 'The test suite for '+testId+' could not be found.'
    };
  },

  TESTSUITE_ERROR: function(testId, error) {
    return {
      status: 'error',
      message: 'There was an error while executing the test suite for '+testId,
      error: error
    };
  },

  buildResults: function(tests) {
    return _(tests.lists)
      .pick(function(versions, listId) {
        return ManualEvaluationsCtrl.getEvaluation(listId) !== null
      })
      .map(function(versions, listId) {
        var approvedTypes = ManualEvaluationsCtrl.getApprovedTypes(listId);
        var declinedTypes = ManualEvaluationsCtrl.getDeclinedTypes(listId);

        return _(versions)
          .map(function(result, version) {
            return {
              listId: listId,
              version: version,
              approvedTypes: approvedTypes,
              declinedTypes: declinedTypes,
              result: result
            };
          })
          .value()
      })
      .value();
  },

  /** DEPRECATED **/
  runAllTests: function(req, res) {
    try {
      var testId = req.params.id;

      if (testsRunning) {
        res.json(TestCtrl.TESTSUITE_RUNNING_RESPONSE(testId));
        return;
      }

      testsRunning = true;

      var testSuite = new TestSuite(testId);
      res.json(TestCtrl.START_TESTSUITE_RESPONSE(testId, ListsCtrl.getValidatedListNames().length));

      console.log('Build TestSuite for', testId);
      testSuite.runTests();
      console.log('... done!');

      testsRunning = false;
    } catch(error) {
      testsRunning = false;
      // res.json(TestCtrl.TESTSUITE_ERROR(testId, error.stack));

      console.error(error.stack);
    }
  },

  getResults: function(req, res) {
    var testId = req.params.id;

    if (testsRunning) {
      res.json(TestCtrl.TESTSUITE_RUNNING_RESPONSE(testId));
      return;
    }

    if (!TestModelCtrl.existsTest(testId)) {
      res.json(TestCtrl.TESTSUITE_NOT_FOUND_RESPONSE(testId));
      return;
    }

    var tests = TestModelCtrl.fetchTest(testId);
    var allResults = TestCtrl.buildResults(tests);
    var firstResults = _.map(allResults, function(versions) {
      return versions[0];
    });
    res.json(firstResults);
  },

  getAllResults: function(req, res) {
    var testId = req.params.id;

    if (testsRunning) {
      res.json(TestCtrl.TESTSUITE_RUNNING_RESPONSE(testId));
      return;
    }

    if (!TestModelCtrl.existsTest(testId)) {
      res.json(TestCtrl.TESTSUITE_NOT_FOUND_RESPONSE(testId));
      return;
    }

    var tests = TestModelCtrl.fetchTest(testId);
    var allResults = TestCtrl.buildResults(tests);
    res.json(allResults);
  },

  getTestIds: function(req, res) {
    // test cases are deprecated!
    // res.json(TestRepository.getAllTestIds());
    res.json(TestModelCtrl.fetchTestIds());
  }

};

module.exports = TestCtrl;
