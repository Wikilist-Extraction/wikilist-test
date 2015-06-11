/*=== Test Model ===*/
'use strict';

var mongoose = require('mongoose');

var TestModel = (function() {
	var TestSchema = mongoose.Schema({
		testId : { type: String, index: { unique: true }},
		lists : {}
	});

	return mongoose.model('Test', TestSchema);
})();

module.exports = TestModel;
