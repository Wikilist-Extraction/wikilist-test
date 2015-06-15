'use strict';

var TestMap = {
  'tfidf': require('./testcases/tfIdfTest'),
  'textEvidence': require('./testcases/textEvidenceTest'),
  'crossedResults': require('./testcases/fullRankingTest')
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
