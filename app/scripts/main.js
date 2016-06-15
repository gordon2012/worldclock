(function($){
	window.app = {};
	$.app = window.app;
	$.app.namespaces = { };

	var namespaces = $.app.namespaces;

	$.app.register = function(namespace, object) {
		var leaf = _.reduce(namespace.split("."), function(context, name) {
			context[name] = context[name] || {};
			context = context[name];
			return context;
		}, namespaces);
		$.extend(leaf, object);
	};

	$(document).ready(function() {
		namespaces.controllers.MainViewController.initialize();
	});

})(jQuery);
