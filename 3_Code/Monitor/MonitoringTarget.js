var exec = require('child_process').exec;

function MonitoringTarget(id) {
	this.id = id;
	this.listener = [];
	this.interval = 0;
	this.cmd = "";
	this.formateData = function(data){return data;};
	
	var reg = new RegExp(/ +/g);
	switch (id) {
		case "all":
			this.cmd = "top -p -n 1 -b";
			break;
		case "sys":
			break;
		default:
			this.cmd = "top -p " + this.id + " -n 1 -b";
			this.formateData = function(data){
				return data.split("\n")[7].replace(reg, ',');
			};
			break;
	}

	if (typeof this.tick === "undefined") {
		MonitoringTarget.prototype.addListener = function(client, interval) {
			this.listener.push(client);
			
			if(this.interval === 0){this.interval = interval;return;}
			for(var i = Math.min(interval, this.interval); i > 0; i--){
				if(this.interval % i === 0 && interval % i === 0){
					this.interval = interval;
					return;
				}
			}
		};
		MonitoringTarget.prototype.refreshCallback = function(error, stdout, stderr, tock) {
			if(error){console.log("monitoring target error: id[" + this.id + "]  cmd[" + this.cmd + "]" + (new Date() - 0));}
			if(stderr){console.log("monitoring target stderr: id[" + this.id + "]  cmd[" + this.cmd + "]" + (new Date() - 0));}
			
			var data = this.formateData(stdout);
			for(var i = 0, l = this.listener.length; i < l; i++){
				if (tock % this.listener[i].intervalList[this.id] !== 0) continue;
				this.listener[i].send(data);
			}
		};
		MonitoringTarget.prototype.tick = function(tock) {
			if (tock % this.interval !== 0) return;
			var self = this;
			exec(this.cmd, function(error, stdout, stderr){self.refreshCallback(error, stdout, stderr, tock);});
		};
	}
}

exports.MonitoringTarget = MonitoringTarget;