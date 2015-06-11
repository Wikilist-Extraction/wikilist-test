'use strict';

var _ = require('lodash');

function TestCase(listOfResources) {
  this.listOfResources = listOfResources;
}

TestCase.prototype = {
    NO_TEST_CASE: 'method this.test is not defined',
    NO_LIST_OF_RESOURCES: 'no resources defined',
    INVALID_TEST_RESULTS: 'this.test() should return an array of types',
    INVALID_TEST_RESULT: 'each type-result should be a string',

    run: function() {
      if (!_.isArray(this.listOfResources)) { throw new Error(this.NO_LIST_OF_RESOURCES); }
      if (!_.isFunction(this.test)) { throw new Error(this.NO_TEST_CASE); }

      var testResults = this.test();

      if (!_.isArray(testResults)) { throw new Error(this.INVALID_TEST_RESULTS); }
      _.each(testResults, function(type) { if (!_.isString(type)) { throw new Error(this.INVALID_TEST_RESULT); } });

      return testResults;
    }
};

module.exports = TestCase;
