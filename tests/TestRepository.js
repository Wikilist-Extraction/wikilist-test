'use strict';

var TestMap = {
  'tfidf': require('./testcases/tfIdfTest')
};

var TestRepository = {
  getTestCaseById: function(testId) {
    return TestMap[testId];
  },

  getAllTestIds: function() {
    return Object.keys(TestMap);
  }
};

module.exports = TestRepository;
