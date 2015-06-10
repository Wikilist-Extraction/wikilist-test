/*=== ManualEvaluation Controller ===*/
var sync = require("synchronize");
var ManualEvaluation = require("../models/ManualEvaluation")();

var ManualEvaluationsCtrl = {
	exists : function(listId) {
		var lists = sync.await( ManualEvaluation.find({ listId: listId }, sync.defer()) );
		return lists.length > 0;
	},


	create : function(req, res) {
		var manualevaluation = new ManualEvaluation(req.body);
		manualevaluation.save(function (err, manualevaluation) {
			console.log("Saved data for: ", manualevaluation.listId);
			res.send(manualevaluation);
		});
	},

	fetchAll : function (req, res) {
		ManualEvaluation.find(function (err, manualevaluations) {
			res.send(manualevaluations);
		});
	},

	fetch : function (req, res) {
		ManualEvaluation.find({listId:req.params.id}, function (err, manualevaluations) {
			res.send(manualevaluations[0]);
		});
	},

	update : function (req, res) {
		delete req.body._id;
		ManualEvaluation.update({listId:req.params.id}, req.body, function (err, manualevaluation) {
			console.log("Update data for:", manualevaluation.listId);
			res.send(manualevaluation);
		});
	},

	delete : function (req, res) {
		ManualEvaluation.findOneAndRemove({listId:req.params.id}, function (err, manualevaluation) {
			res.send(manualevaluation);
		});
	}
}

module.exports = ManualEvaluationsCtrl;
