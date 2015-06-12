/*=== ListCache Model ===*/
'use strict';

var mongoose = require('mongoose');

var ListCacheModel = (function() {

	var ListCacheSchema = mongoose.Schema({
		listId : { type: String, index: { unique: true }},
		cache : mongoose.Schema.Types.Mixed
	});

	return mongoose.model('ListCache', ListCacheSchema);
})();

module.exports = ListCacheModel;
