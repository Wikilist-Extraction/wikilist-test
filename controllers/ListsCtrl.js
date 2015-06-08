/*=== Lists Controller ===*/

var fs = require("fs");
var _ = require("lodash");

function listIdFromFilename(filename) {
	return filename.replace(".js", "");
}

var ListsCtrl = {
	fetchAll : function(req, res) {
		res.json( _.map(fs.readdirSync(__dirname + "/../lists"), listIdFromFilename) );
	}
}

module.exports = ListsCtrl;
