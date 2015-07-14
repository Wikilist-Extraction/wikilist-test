/*=== List Model ===*/
'use strict';

var mongoose = require('mongoose');

var ListModel = (function() {

	var ListSchema = mongoose.Schema({
		listId : { type: String, index: { unique: true }},
	 	entities : { type: Array }
	});

	return mongoose.model('List', ListSchema);
})();

module.exports = ListModel;
