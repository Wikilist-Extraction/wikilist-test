/*=== Lists Controller ===*/
'use strict';

var fs = require("fs");
var sync = require("synchronize");
var _ = require("lodash");
var ListModel = require("../models/ListModel");
var ListCacheCtrl = require('./ListCacheCtrl');
var ManualEvaluationCtrl = require("./ManualEvaluationsCtrl");

var URL_PREFIX = "http://dbpedia.org/resource/";

var ListsCtrl = {};

_.extend(ListsCtrl, {
	NOT_FOUND_RESPONSE: {
	  "status": "not_found",
	  "message": "Resource was not found"
	},

	SUCCESSFULLY_SAVED: {
		'status': 'ok',
		'message': 'Your list was stored.'
	},

	NO_LIST_ID: {
		'status': 'error',
		'message': 'Provide a list id as part of the url.'
	},

	NO_ENTITIES: {
		'status': 'error',
		'message': 'Provide an array of dbpedia resource links as `entities` key in the body.'
	},


	getJsResourceById: function(listId) {
	  try {
	    return require("../lists/"+listId+".js");
	  } catch(e) {
	    if (e.code === "MODULE_NOT_FOUND") {
	      return null;
	    }

	    throw e;
	  }
	},

	getResourceById: function(listId) {
		return ListCacheCtrl.cacheContainsList(listId) ? ListCacheCtrl.fetch(listId).entities : ListsCtrl.getJsResourceById(listId);
	},

	buildUrlById: function(listId) {
		return URL_PREFIX+listId;
	},

	existsEvaluatedList: function (listId) {
		return ManualEvaluationCtrl.exists(listId);
	},

	listIdFromFilename: function (filename) {
		return filename.replace(".js", "");
	},

	isJsFile: function (file) {
		var tokens = file.split(".");
		return tokens[tokens.length - 1] == "js";
	},

	getListNames: function () {
		var jsFilenames = fs.readdirSync(__dirname + "/../lists");
		var jsListNames = _(jsFilenames)
			.filter(ListsCtrl.isJsFile)
		 	.map(ListsCtrl.listIdFromFilename)
			.value();
		var modelListNames = _.pluck(ListCacheCtrl.fetchAll(), "listId");

		return _.union(jsListNames, modelListNames);
	},

	getListNamesWithStatus: function () {
		var listNames = ListsCtrl.getListNames();
		return _.map(listNames, function(listId) {
			return { listId: listId, validated: ListsCtrl.existsEvaluatedList(listId) };
		});
	},

	getValidatedListNames: function() {
		return _(ListsCtrl.getListNamesWithStatus())
      .filter(function(list) { return list.validated; })
      .pluck('listId')
			.value();
	},

	createEmptyList: function(listId) {
		var listModel = new ListModel({
			listId: listId,
			entities: []
		});

		return sync.await(listModel.save( sync.defer() ));
	},

	/** DEPRECATED **/
	create: function(req, res) {
		var listId = req.params.id;
		var pushedEntites = req.body.entities;

		if (!listId) {
			res.json(ListsCtrl.NO_LIST_ID);
			return;
		}

		if (!pushedEntites || !_.isArray(pushedEntites)) {
			res.json(ListsCtrl.NO_ENTITIES);
			return;
		}

		// create new list or fetch existing one
		var listModel;
		if (ListsCtrl.existsInModel(listId)) {
			listModel = ListsCtrl.fetchFromModel(listId);
		} else {
			listModel = ListsCtrl.createEmptyList(listId);
		}

		// override list entries of model
		listModel.entities = pushedEntites;

		sync.await( listModel.save( sync.defer() ));
		res.json(ListsCtrl.SUCCESSFULLY_SAVED);
	},

	/** DEPRECATED **/
	// fetchFromModel: function(listId) {
	// 	var lists = sync.await( ListModel.find({ listId: listId }, sync.defer() ));
	// 	return lists[0];
	// },
	//
	// fetchAllFromModel: function() {
	// 	return sync.await( ListModel.find({}, sync.defer() ));
	// },
	//
	// existsInModel: function(listId) {
	// 	var lists = sync.await( ListModel.find({ listId: listId }, sync.defer() ));
	// 	return lists.length > 0;
	// },

	fetch: function (req, res) {
		var listId = req.params.id;
		var resource = ListsCtrl.getResourceById(listId);

		if (resource === null) {
      res.json(_.extend({}, ListsCtrl.NOT_FOUND_RESPONSE, { resource: listId }));
    }

		res.json(resource);
	},

	fetchAll : function (req, res) {
		res.json(ListsCtrl.getListNames());
	},

	fetchAllWithStatus : function (req, res) {
		res.json(ListsCtrl.getListNamesWithStatus());
	}
});

module.exports = ListsCtrl;
