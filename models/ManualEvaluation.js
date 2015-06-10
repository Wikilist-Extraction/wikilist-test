/*=== ManualEvaluation Model ===*/

var mongoose = require('mongoose');

var ManualEvaluationModel = function() {

	var ManualEvaluationSchema = mongoose.Schema({
		listId : { type: String, index: { unique: true }},
		approvedTypes : [String],
		declinedTypes : [String]
	});

	return mongoose.model('ManualEvaluation', ManualEvaluationSchema);
}

module.exports = ManualEvaluationModel;
