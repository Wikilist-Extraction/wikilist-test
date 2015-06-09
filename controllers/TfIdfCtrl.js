/*=== TfIdf Controller ===*/
var _ = require("lodash");
var tfIdf = require("tf-idf-wiki-lists").tfIdf;

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

var cache = {};

var TfIdfCtrl = {
	fetch : function(req, res) {
		var listId = req.params.id;

    if (listId in cache) {
      res.json(cache[listId]);
      return;
    }

    var listOfResources = getResourceById(listId);

    if (listOfResources === null) {
      res.json(_.extend({}, NOT_FOUND_RESPONSE, { resource: listId }));
    }

    promisedTfIdf(listOfResources)
      .then(renameResults)
      .then(function(results) {
        cache[listId] = results;
        res.json(results);
      });
	}
}

module.exports = TfIdfCtrl;
