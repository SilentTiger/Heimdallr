var express = require("express");

var startWebServer = (function(){
	var serverStarted = false;
	return function(){
		if(serverStarted) {return;}
		serverStarted = true;
		
		var app = express();
		app.use(express.bodyParser());
	
		app.configure(function () {
			app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
			app.use(express.logger());
			app.use(express.static(__dirname + '\public'));
		});
	
		app.listen(8685);
	}

})();

exports.run = startWebServer;