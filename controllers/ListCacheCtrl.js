/*=== ListCache Controller ===*/

var ListCache = require("../models/ListCache")();
var sync = require("synchronize");

var ListCacheCtrl = {
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
}

module.exports = ListCacheCtrl;
