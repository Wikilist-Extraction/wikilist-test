'use strict';

var tfIdf = require('tf-idf-wiki-lists').tfIdf;
var TestCase = require('../TestCase');
var sync = require('synchronize');
var _ = require('lodash');

function Test() {
  TestCase.apply(this, arguments);
}

Test.prototype = _.extend({}, TestCase.prototype, {
  syncTfIdf: function (listOfResources) {
    function errorWrappedTfIdf(listOfResources, callback) {
      tfIdf(listOfResources, function(results, counts) { callback(null, results, counts); });
    }

    return sync.await(errorWrappedTfIdf(listOfResources, sync.defer()));
  },

  test: function() {
    var results = this.syncTfIdf(this.listOfResources);

    return _(results)
      .sortBy('tfIdf')
      .reverse()
      .slice(0,5)
      .pluck('typeUri')
      .value();
  }
});


module.exports = Test;
