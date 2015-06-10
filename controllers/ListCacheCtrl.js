/*=== ListCache Controller ===*/

var sync = require("synchronize");
var _ = require("lodash");
var ListCache = require("../models/ListCache")();
var ListsCtrl = require("./ListsCtrl");
var TfIdfCtrl = require("./TfIdfCtrl");

var ListCacheCtrl = {};

_.extend(ListCacheCtrl, {
	cacheContainsList : function(listId) {
		var lists = sync.await( ListCache.find({ listId: listId }, sync.defer()) );
		return lists.length > 0;
	},

	getListFromCache : function(listId) {
		var lists = sync.await( ListCache.find({ listId: listId }, sync.defer()) );
		return lists[0].cache;
	},

	addListToCache : function(listId, results) {
		var cachedList = new ListCache({ listId: listId, cache: results })
		return sync.await( cachedList.save(sync.defer()) );
	}
});

module.exports = ListCacheCtrl;
