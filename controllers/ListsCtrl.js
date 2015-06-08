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

function getListNames() {
	return _.map(fs.readdirSync(__dirname + "/../lists"), listIdFromFilename);
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

var ListsCtrl = {
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
