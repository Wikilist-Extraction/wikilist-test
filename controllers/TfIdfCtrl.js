/*=== TfIdf Controller ===*/
var _ = require("lodash");
var tfIdf = require("tf-idf-wiki-lists").tfIdf;
var ListCacheCtrl = require("../controllers/ListCacheCtrl");
var Promise = require("bluebird");

var NOT_FOUND_RESPONSE = {
  "status": "not_found",
  "message": "Resource was not found"
};

function promisedTfIdf(resources) {
  return new Promise(function(resolve) {
    tfIdf(resources, function(results, counts) {
      resolve(results);
    });
  });
};

function getResourceById(listId) {
  try {
    return require("../lists/"+listId+".js");
  } catch(e) {
    if (e.code === "MODULE_NOT_FOUND") {
      return null;
    }

    throw e;
  }
}

function renameResults(results) {
  return _.map(results, function(result) {
    return result;
  });
}

var TfIdfCtrl = {
	fetch : function(req, res) {
		var listId = req.params.id;
    var listOfResources = getResourceById(listId);

    if (ListCacheCtrl.cacheContainsList(listId)) {
      res.json(ListCacheCtrl.getListFromCache(listId));
      return;
    }

    if (listOfResources === null) {
      res.json(_.extend({}, NOT_FOUND_RESPONSE, { resource: listId }));
    }

    promisedTfIdf(listOfResources)
      .then(renameResults)
      .then(function(results) {
        ListCachCtrl.addListToCache(listId, results);
        res.json(results);
      });
	}
}

module.exports = TfIdfCtrl;
