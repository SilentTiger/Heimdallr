var webServer = require("./WebServer/webServer.js"),
    monitor = require("./Monitor/monitor.js").Monitor;

webServer.start(8685);
monitor.start(8080);