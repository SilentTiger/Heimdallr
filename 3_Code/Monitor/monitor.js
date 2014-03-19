var WebSocketServer = require('websocket').server,
    http = require('http'),
    Client = require('./Client.js').Client,
    MonitoringTarget = require('./MonitoringTarget.js').MonitoringTarget;

var Monitor = (function(){
	var serverStarted = false;
	var interval = 1000;
	var monitoringTargets = {};
	var tock = 0;
	
	var startTime = new Date() - 0;
	function startClock(){
		for(var i in monitoringTargets){
			monitoringTargets[i].tick(tock);
		}
		tock++;
		var delay = startTime + interval * tock - new Date();
		while(delay <= 0){
			tock++;
			delay = startTime + interval * tock - new Date();
		}
		setTimeout(startClock, delay);
	}
	
	
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
            console.log("new connection from " + connection.remoteAddress + " at " + now.toString() + " | " + (now - 0));

            var client = new Client(connection);
            client.addEventListener('message', onMessage);
            client.addEventListener('close', onClose);
        });
        
        startClock();
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
		client.intervalList[data.id] = data.interval;
		
		if(!monitoringTargets[data.id]) {
			monitoringTargets[data.id] = new MonitoringTarget(data.id);
		}
		monitoringTargets[data.id].addListener(client);
	};
	function removeMonitoringTarget(client, data){
		//TO DO
	};
	
	return {
		start: startMonitor,
		addMonitoringTarget: addMonitoringTarget
	};
})();

exports.Monitor = Monitor;