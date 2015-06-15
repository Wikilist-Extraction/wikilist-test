'use strict';

var rank = require('wiki-list-ranking').rank;
var TestCase = require('../TestCase');
var sync = require('synchronize');
var _ = require('lodash');

function Test() {
  TestCase.apply(this, arguments);
}

Test.prototype = _.extend({}, TestCase.prototype, {
  // needsParentResource: true,

  syncRanking: function (listOfResources, parentResource) {
    function errorWrappedTfIdf(listOfResources, parentResource, callback) {
      rank(listOfResources, parentResource).then(function(results) { callback(null, results); });
    }

    return sync.await(errorWrappedTfIdf(listOfResources, parentResource, sync.defer()));
  },

  test: function() {
    var results = this.syncRanking(this.listOfResources, this.parentResource);

    return _(results.crossedResults)
      .sortBy('score')
      .reverse()
      .slice(0,5)
      .pluck('typeUri')
      .value();
  }
});


module.exports = Test;
