/*=== ManualEvaluation Controller ===*/
'use strict';

var sync = require('synchronize');
var ManualEvaluation = require('../models/ManualEvaluation');

var ManualEvaluationsCtrl = {
	exists : function(listId) {
		var lists = sync.await( ManualEvaluation.find({ listId: listId }, sync.defer()) );
		return lists.length > 0;
	},

	deleteEvaluation: function(listId) {
		return sync.await( ManualEvaluation.findOneAndRemove({listId: listId}, sync.defer()) );
	},

	getEvaluation: function(listId) {
		return sync.await( ManualEvaluation.findOne({ listId: listId }, sync.defer()) );
	},

	getApprovedTypes: function(listId) {
		return ManualEvaluationsCtrl.getEvaluation(listId).approvedTypes;
	},

	getDeclinedTypes: function(listId) {
		return ManualEvaluationsCtrl.getEvaluation(listId).declinedTypes;
	},


	create : function(req, res) {
		if (ManualEvaluationsCtrl.exists(req.body.listId)) {
			ManualEvaluationsCtrl.deleteEvaluation(req.body.listId);
		}

		var manualevaluation = new ManualEvaluation(req.body);
		manualevaluation.save(function (err, manualevaluation) {
			if (err) {
				throw err;
			}

			console.log('Saved data for: ', manualevaluation.listId);
			res.json(manualevaluation);
		});
	},

	fetchAll : function (req, res) {
		ManualEvaluation.find(function (err, manualevaluations) {
			res.json(manualevaluations);
		});
	},

	fetch : function (req, res) {
		ManualEvaluation.find({listId:req.params.id}, function (err, manualevaluations) {
			if (err || manualevaluations.length == 0) {
				res.json({
					listId: req.params.id,
					approvedTypes: [],
					declinedTypes: []
				});
				return
			}
			res.json(manualevaluations[0]);
		});
	},

	update : function (req, res) {
		delete req.body._id;
		ManualEvaluation.update({listId: req.params.id}, req.body, {upsert: true}, function (err, numAffected) {
			console.log('Update affected:', numAffected);
			if (numAffected >= 1) {
				res.json({message: "success"})
			} else if (err) {
				res.json({message: err });
			} else {
				res.json({message: "nothing updated"});
			}
		});
	},

	delete : function (req, res) {
		ManualEvaluation.findOneAndRemove({listId:req.params.id}, function (err, manualevaluation) {
			res.json(manualevaluation);
		});
	}
}

module.exports = ManualEvaluationsCtrl;
