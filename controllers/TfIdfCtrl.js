/*=== TfIdf Controller ===*/
var _ = require("lodash");
var sync = require("synchronize");
var tfIdf = require("tf-idf-wiki-lists").tfIdf;
var ListCacheCtrl = require("../controllers/ListCacheCtrl");
var ListsCtrl = require("../controllers/ListsCtrl");
var Promise = require("bluebird");

var NOT_FOUND_RESPONSE = {
  "status": "not_found",
  "message": "Resource was not found"
};

function syncTfIdf(listOfResources) {
  function errorWrappedTfIdf(listOfResources, callback) {
    tfIdf(listOfResources, function(results, counts) { callback(null, results, counts); })
  }

  return sync.await(errorWrappedTfIdf(listOfResources, sync.defer()));
}

var TfIdfCtrl = {
	fetch : function(req, res) {
		var listId = req.params.id;
    var listOfResources = ListsCtrl.getResourceById(listId);

    if (ListCacheCtrl.cacheContainsList(listId)) {
      console.log("Return TfIdf Results from cache:", listId);
      res.json(ListCacheCtrl.getListFromCache(listId));
      return;
    }

    if (listOfResources === null) {
      console.log("No Resource found:", listId);
      res.json(_.extend({}, ListsConroller.NOT_FOUND_RESPONSE, { resource: listId }));
      return;
    }

    console.log("Fetching TfIdf Results ... ", listId);
    var results = syncTfIdf(listOfResources);
    ListCacheCtrl.addListToCache(listId, results);
    console.log("... done!");
    res.json(results);
	}
}

module.exports = TfIdfCtrl;
