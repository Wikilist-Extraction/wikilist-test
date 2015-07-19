/*=== TfIdf Controller ===*/
var _ = require("lodash");
var sync = require("synchronize");
var tfIdf = require("tf-idf-wiki-lists").tfIdf;
var ListsCtrl = require("../controllers/ListsCtrl");
var ListCacheCtrl = require("../controllers/ListCacheCtrl");

var TfIdfCtrl = {};

_.extend(TfIdfCtrl, {
  NO_LIST_ID: {
    status: 'error',
    message: 'one of the lists did not provide a `listId` key'
  },

  NO_LIST_RESULTS: {
    status: 'error',
    message: 'one of the lists did not provide `results` as an array'
  },

  SUCCESSFULLY_SAVED: {
    status: 'ok',
    message: 'all lists are stored successfully'
  },


  syncTfIdf: function (listOfResources) {
    function errorWrappedTfIdf(listOfResources, callback) {
      tfIdf(listOfResources, function(results, counts) { callback(null, results, counts); })
    }

    return sync.await(errorWrappedTfIdf(listOfResources, sync.defer()));
  },

  createAll : function(req, res) {
    var pushedLists = req.body.lists;

    if (!pushedLists) {
      res.json();
      return;
    }

    var hasWrongFormat = false;
    _.forEach(pushedLists, function(list) {
      if (!list.listId) {
        res.json(TfIdfCtrl.NO_LIST_ID);
        hasWrongFormat = true;
        return false;
      }

      if (!list.results || !_.isArray(list.results)) {
        res.json(TfIdfCtrl.NO_LIST_RESULTS);
        hasWrongFormat = true;
        return false;
      }

      if (!ListCacheCtrl.cacheContainsList(list.listId)) {
        console.log('creating list cache for %s', list.listId);
        ListCacheCtrl.addListToCache(list.listId.replace(/\./g, ''), list.results);
      } else {
        console.log('updating list cache for %s', list.listId)
        var listCacheModel = ListCacheCtrl.fetch(list.listId);
        listCacheModel.cache = list.results;
        var saved = sync.await( listCacheModel.save( sync.defer() ) );
      }
    });

    if (hasWrongFormat) {
      return;
    }
    res.json(TfIdfCtrl.SUCCESSFULLY_SAVED);
  },

	fetch : function(req, res) {
		var listId = req.params.id;
    var listOfResources = ListsCtrl.getResourceById(listId);

    if (ListCacheCtrl.cacheContainsList(listId)) {
      console.log("Return TfIdf Results from cache:", listId);
      res.json(ListCacheCtrl.getListFromCache(listId));
      return;
    }

    res.json(_.extend({}, ListsCtrl.NOT_FOUND_RESPONSE, { resource: listId }));
    /** DEPRECATED -- all results are provided by the dump parser and should already be in the cache **/
    // if (listOfResources === null) {
    //   console.log("No Resource found:", listId);
    //   res.json(_.extend({}, ListsCtrl.NOT_FOUND_RESPONSE, { resource: listId }));
    //   return;
    // }
    //
    // console.log("Fetching TfIdf Results ... ", listId, listOfResources.length);
    // var results = TfIdfCtrl.syncTfIdf(listOfResources);
    // ListCacheCtrl.addListToCache(listId, results);
    // console.log("... done!");
    // res.json(results);
	}
});

module.exports = TfIdfCtrl;
