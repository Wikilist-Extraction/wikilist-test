/*=== Lists Controller ===*/

var fs = require("fs");
var _ = require("lodash");
var ManualEvaluationCtrl = require("./ManualEvaluationsCtrl");

function listExists(listId) {
	return new Promise(function(resolve) {
		ManualEvaluationCtrl.exists(listId, function(exists) { resolve(exists); });
	});
}

function listIdFromFilename(filename) {
	return filename.replace(".js", "");
}

function isJsFile(file) {
	var tokens = file.split(".");
	return tokens[tokens.length - 1] == "js";
}

function getListNames() {
	var jsFiles = _.filter(fs.readdirSync(__dirname + "/../lists"), isJsFile);
	return _.map(jsFiles, listIdFromFilename);
}

function getListNamesWithStatus() {
	var listNames = getListNames();
	return _.map(listNames, function(listId) {
		return listExists(listId)
			.then(function(exists) {
				return { listId: listId, validated: exists };
			});
	});
}

var NOT_FOUND_RESPONSE = {
  "status": "not_found",
  "message": "Resource was not found"
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

var ListsCtrl = {
	fetch: function(req, res) {
		var resource = getResourceById(req.params.id);

		if (resource === null) {
      res.json(_.extend({}, NOT_FOUND_RESPONSE, { resource: listId }));
    }

		res.json(resource);
	},
	fetchAll : function(req, res) {
		res.json(getListNames());
	},
	fetchAllWithStatus : function(req, res) {
		Promise
			.all(getListNamesWithStatus())
			.then(function(listNamesWithStatus) { res.json(listNamesWithStatus); });
	}
}

module.exports = ListsCtrl;
