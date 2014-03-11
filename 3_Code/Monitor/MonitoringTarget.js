var os = require('os');


function MonitoringTarget(id){
	this.id = id;
    this.listener = "";
    this.data = "";
    if(typeof this.refresh === "undefined"){
        MonitoringTarget.prototype.refresh = function(){
            this.data = os.freemem();
        }
    }
}

exports.MonitoringTarget = MonitoringTarget;