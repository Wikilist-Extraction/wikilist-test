var _ = require("lodash");
var TfIdfCtrl = require("./TfIdfCtrl");
var ListsCtrl = require("./ListsCtrl");
var ListCacheCtrl = require("./ListCacheCtrl");

var CacheCtrl = {};

_.extend(CacheCtrl, {
  DONE_WARMUP_RESPONSE: {
    "status": "in_progress",
    "message": "All list results are currently fetched and cached."
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
			CacheCtrl.fetchAndCacheList(listId);
		});

		console.log("... done!");
	},


	warmup : function(req, res) {
		CacheCtrl.cacheAllLists();
		res.json(CacheCtrl.DONE_WARMUP_RESPONSE);
	}
});

module.exports = CacheCtrl;
