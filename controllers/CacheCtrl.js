'use strict';

var _ = require("lodash");
var TfIdfCtrl = require("./TfIdfCtrl");
var ListsCtrl = require("./ListsCtrl");
var ListCacheCtrl = require("./ListCacheCtrl");

var CacheCtrl = {};

_.extend(CacheCtrl, {
  START_WARMUP_RESPONSE: {
    "status": "in_progress",
    "message": "Started fetching and caching all list results."
  },
  isCaching: false,
  currentlyCachingList: "",

  inProgressRespone : function() {
    return {
      "status": "in_progress",
      "message": "Currently caching: " + CacheCtrl.currentlyCachingList
    }
  },

	fetchAndCacheList : function(listId) {
		var listOfResources = ListsCtrl.getResourceById(listId);
		var results = TfIdfCtrl.syncTfIdf(listOfResources);
		ListCacheCtrl.addListToCache(listId, results);
	},

	cacheAllLists : function() {
		var allLists = _.filter(ListsCtrl.getListNames(), function(listId) { return !ListCacheCtrl.cacheContainsList(listId); });

		console.log("Caching "+ allLists.length +" lists");

		_.each(allLists, function(listId) {
			console.log("Currently caching", listId);
      CacheCtrl.currentlyCachingList = listId;
			CacheCtrl.fetchAndCacheList(listId);
		});

		console.log("... done!");
	},

	warmup : function(req, res) {
    if (CacheCtrl.isCaching) {
      res.json(CacheCtrl.inProgressRespone());
      return;
    }

		res.json(CacheCtrl.START_WARMUP_RESPONSE);
    CacheCtrl.isCaching = true;
		CacheCtrl.cacheAllLists();
    CacheCtrl.isCaching = false;
	}
});

module.exports = CacheCtrl;
