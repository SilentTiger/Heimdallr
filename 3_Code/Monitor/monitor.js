var WebSocketServer = require('websocket').server,
    http = require('http'),
    Client = require('./Client.js').Client;

var Monitor = (function(){
	var serverStarted = false;
	var clientsArray = new Array();
	var interval = 1000;

	function startMonitor(port) {
		if (serverStarted) {return;}
		serverStarted = true;

		var server = http.createServer();
		server.listen(port);

		var wsServer = new WebSocketServer({
			httpServer : server,
			autoAcceptConnections : true
		});

        wsServer.on('connect', function(connection) {
        	var now = new Date();
            console.log("new connection from " + connection.remoteAddress + " at " + now.toString() + " | " + (now - 0), connection);

            var client = new Client(connection);
            client.addEventListener('message', onMessage);
            client.addEventListener('close', onClose);
        });
	};
	
	function onMessage(sender, msg){
		var now = new Date();
		console.log("new message from " + sender.conn.remoteAddress + " at " + now.toString() + " | " + (now - 0), msg);
		
		if (typeof Monitor[msg.cmd] === 'function') {
			Monitor[msg.cmd].apply(sender, msg.data);
		}
	}
	
	function onClose(sender, reasonCode, desc){
		var now = new Date();
		console.log("socket close from " + sender.conn.remoteAddress + " at " + now.toString() + " | " + (now - 0), reasonCode, desc);
	}

	function addMonitUnit(client, data){
		if(client.listened){return;}
		client.listened = true;
		clientsArray.push(client);
	};
	function removeMonitUnit(client, data){
		//TO DO
	};
	
	return {
		start: startMonitor,
		addMonitUnit:addMonitUnit
	};
})();

exports.Monitor = Monitor;