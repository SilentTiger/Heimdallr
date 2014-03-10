var WebSocketServer = require('websocket').server, http = require('http');

var startMonitor = (function() {
	var serverStarted = false;
	return function() {
		if (serverStarted) {return;}
		serverStarted = true;

		var server = http.createServer();
		server.listen(8080);

		var wsServer = new WebSocketServer({
			httpServer : server,
			autoAcceptConnections : true
		});

		wsServer.on('request', function(request) {
			console.log(new Date(), request);
		});
	}

})();

exports.run = startMonitor;