var WebSocketServer = require('websocket').server,
    http = require('http'),
    Client = require('./Client.js').Client,
    MonitoringTarget = require('./MonitoringTarget.js').MonitoringTarget;

var Monitor = (function(){
	var serverStarted = false;
	var clientsArray = new Array();
	var interval = 1000;
	var monitoringTargets = {};

	var timerRefresh = setInterval(function(){
		for(var i in monitoringTargets){
			monitoringTargets[i].refresh();
		}
	}, interval);

	var timerSend = setInterval(function(){
		for(var j = 0, l = clientsArray.length; j < l; j++){
			var data = [];
			for(var i = 0, l = clientsArray[j].targets.length; i < l; i++){
				data.push({id: clientsArray[j].targets[i], data: monitoringTargets[clientsArray[j].targets[i]].data});
			}
			clientsArray[j].send(data);
		}
	}, interval);
	
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
			Monitor[msg.cmd].apply(Monitor, [sender, msg.data]);
		}
	}
	
	function onClose(sender, reasonCode, desc){
		var now = new Date();
		console.log("socket close from " + sender.conn.remoteAddress + " at " + now.toString() + " | " + (now - 0), reasonCode, desc);
	}

	function addMonitoringTarget(client, data){
		if(client.listened){return;}
		client.listened = true;
		clientsArray.push(client);
		
		if(!monitoringTargets[data.id]) {
			monitoringTargets[data.id] = new MonitoringTarget(data.id);
		}
		monitoringTargets[data.id].listener += client.id + ";";
		client.addTarget(data.id);
	};
	function removeMonitUnit(client, data){
		//TO DO
	};
	
	return {
		start: startMonitor,
		addMonitoringTarget: addMonitoringTarget
	};
})();

exports.Monitor = Monitor;