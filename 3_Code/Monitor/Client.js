﻿function Client(con){
	this.conn = con;
	this.requirements = [];
	this._eventHandles = {};
	if(typeof this.send === "undefined"){
		Client.prototype.send = function(msg){
			this.conn.send(msg);
		}
		Client.prototype.addEventListener = function (event, callback) {
		    if (typeof callback !== 'function') {
		        throw new Error('the callback argument is not a function');
		        return;
		    }
		    if (typeof this._eventHandles[event] === 'undefined') {
		        this._eventHandles[event] = [];
		    }
		    this._eventHandles[event].push(callback);
		}
		Client.prototype.removeEventListener = function (event, callback) {
		    if (this._eventHandles[event] instanceof Array) {
		        for (var i = this._eventHandles[event].length - 1 ; i >= 0 ; i--) {
		            if (this._eventHandles[event][i] === callback) {
		                this._eventHandles[event].splice(i, 1);
		            }
		        }
		    }
		}
		Client.prototype.triggerEvent = function (event, args) {
		    if (this._eventHandles[event] instanceof Array) {
		        for (var i = 0 ; i < this._eventHandles[event].length ; i++) {
		            this._eventHandles[event][i].apply(this, args);
		        }
		    }
		}
	}
	var _self = this;
	this.conn.on("message", function(message){_self.triggerEvent('message', [_self, message]);});
	this.conn.on("close", function(reasonCode, description){_self.triggerEvent('close', [_self, reasonCode, description]);});
	this.conn.on("error", function(error){
		var now = new Date();
		console.log("ERROR from " + _self.conn.remoteAddress + " at " + now.toString() + " | " + (now - 0), error);
		_self.triggerEvent('close', [_self, error]);
	});
}

exports.Client = Client;