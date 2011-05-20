var sys = require('sys'), fs = require('fs'), util = require('util'), path = require('path');

var resources = {
	web : {
		root : "."
	}
};

exports.init = {
	task : function() {

	}
};
exports.serve = {
	depends : [],
	task : function() {
		var location = path.join(cwd, resources.web.root);
		plugins['serve'].http(location, 8080);
	}
};