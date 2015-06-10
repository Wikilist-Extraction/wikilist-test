/*=== ListCache Controller ===*/

var ListCache = require("../models/ListCache")();
var sync = require("synchronize");

var ListCacheCtrl = {
	cacheContainsList : function(listId) {
		return sync.await(ListCache.find({ listId: listId }, function(error, lists) {
			if (error !== null) {
				throw error;
			}

			sync.defer(lists.length > 0);
		}));
	},

	getListFromCache : function(listId) {
		return sync.await( ListCache.find({listId:req.params.id}, function (err, list) {
      if (error !== null) {
        throw error;
      }

			sync.defer(list[0].cache);
		}));
	}
}

module.exports = ListCacheCtrl;
