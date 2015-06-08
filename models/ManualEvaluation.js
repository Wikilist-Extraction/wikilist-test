/*=== ManualEvaluation Model ===*/

var mongoose = require('mongoose');

var ManualEvaluationModel = function() {

	var ManualEvaluationSchema = mongoose.Schema({
		listId : String, manualEvaluatedTypes : [String]
	});

	return mongoose.model('ManualEvaluation', ManualEvaluationSchema);
}

module.exports = ManualEvaluationModel;
