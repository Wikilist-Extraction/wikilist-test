/*=== ListCache Controller ===*/
"use strict";

var sync = require("synchronize");
var _ = require("lodash");
var ListCache = require("../models/ListCache");
var ListsCtrl = require("./ListsCtrl");

var ListCacheCtrl = {};

_.extend(ListCacheCtrl, {
	cacheContainsList : function(listId) {
		var lists = sync.await( ListCache.find({ listId: listId }, sync.defer()) );
		return lists.length > 0;
	},

	getListFromCache : function(listId) {
		return ListCacheCtrl.fetch(listId).cache;
	},

	fetch : function(listId) {
		var lists = sync.await( ListCache.find({ listId: listId }, sync.defer()) );
		return lists[0];
	},

	fetchAll: function() {
		return sync.await( ListCache.find({}, sync.defer()) );
	},

	addListToCache : function(listId, results) {
		var cachedList = new ListCache({ listId: listId.replace('.', '\.'), cache: results })
		return sync.await( cachedList.save(sync.defer()) );
	}
});

module.exports = ListCacheCtrl;
