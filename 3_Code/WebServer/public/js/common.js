function ShowMask(){
    if ($(".common_mask").length > 0) return false;
    $(document.body).append("<div class='common_mask'></div>");
    setTimeout(function () { $(".common_mask").css("background-color", "rgba(0,0,0,0.4)");}, 1);
    return true;
}

function HideMask(){
    $(".common_mask").css("background-color", "");
    setTimeout(function () { $(".common_mask").remove();}, 300);
}

function ShowBusy(){
    if ($(".busy_mask").length > 0) return false;
    $(document.body).append("<div class='busy_mask'></div>");
    return true;
}

function HideBusy(){
    $(".busy_mask").css("background-color", "");
    setTimeout(function () { $(".busy_mask").remove();}, 300);
}

var HUB = (function(){
    var connections = {};
    var connect = function(uri){
        if (!connections[uri]) {
            var con = new WebSocket("ws://" + uri);
            con.id = uri;
            con.addEventListener("close", function() {
                delete connections[uri];
            });
            connections[uri] = con;
            con.addEventListener('message', DataStorage.processData);
            con.addEventListener('message', ChartManager.processData);
        }
        return connections[uri];
    };
    var getConnection = function(uri){
        return connections[uri];
    };
    var addChart = function(){

    };
    
    return {
        connect: connect,
        getConnection: getConnection
    }
})();

var DataStorage = (function(){
    var data = {};
    var needRecord = {};
    var processData = function(data){
        console.log("DataStorage", data);
    };
    var startRecord = function(targetId){
        data[targetId] = data[targetId] ? data[targetId] : [];
        needRecord[targetId] = true;
    };
    var stopRecord = function(targetId){
        needRecord[targetId] = false;
    };
    var startRecordAll = function(){
        for(var targetId in data){
            needRecord[targetId] = true;
        }
    };
    var stopRecordAll = function(){
        for(var targetId in data){
            needRecord[targetId] = false;
        }
    };
    var clearData = function(targetId){
        data[targetId] = [];
    };
    var clearDataAll = function(){
        for(var targetId in data){
            data[targetId] = [];
        }
    };
    var addTarget = function(targetId){
        data[targetId] = [];
    };
    var delTarget = function(targetId){
        delete data[targetId];
    };

    return {
        processData: processData,
        startRecord: startRecord,
        stopRecord: stopRecord,
        startRecordAll: startRecordAll,
        stopRecordAll: stopRecordAll,
        clearData: clearData,
        clearDataAll: clearDataAll,
        addTarget: addTarget,
        delTarget: delTarget
    };
})();

var ChartManager = (function(){
    var processData = function(data){

    };
    var addChart = function(targetId, type){

    };
    return {
        processData: processData,
        addChart: addChart
    };
})();