var os = require('os');

var getFreeMemoryTotal = function(){
    this.data = os.freemem();
};

function MonitoringTarget(id){
	this.id = id;
    this.listener = "";
    this.data = "";
    this.refresh = getFreeMemoryTotal;
}

exports.MonitoringTarget = MonitoringTarget;