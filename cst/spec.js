
var resources = {
	web : {
		root : "/"
	}
};


exports.all = {
	depends : [ 'serve' ]
};

exports.serve = {
	depends : [],
	task : function() {
		this.plugins.serve.http(process.cwd() + "/" + resources.web.root, 8080);
	}
};

exports.render  = {
	task: function() {
		this.print("test");
	
		var mustache = require('mustache');
		var sys = require('sys');
	
		var view = {
		  title: "Joe",
		  calc: function() {
		    return 2 + 4;
		  }
		};
	
		var template = "{{title}} spends {{calc}}";
	
		var html = mustache.to_html(template, view);
		
		this.print(html);	
	}
};


