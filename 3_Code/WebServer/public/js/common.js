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
            con.addEventListener("close", function() {
                delete connections[uri];
            });
            connections[uri] = con;
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
    var processData = function(data){

    };
    var startRecord = function(targetId){

    };
    var stopRecord = function(targetId){

    };
    var startRecordAll = function(){

    };
    var stopRecordaLL = function(){

    };
    var addTarget = function(targetId){

    };

    return {
        processData: processData,
        startRecord: startRecord,
        stopRecord: stopRecord,
        startRecordAll: startRecordAll,
        stopRecordaLL: stopRecordaLL,
        addTarget: addTarget
    };
})();

var ChartManager = (function(){
    var processData = function(data){

    };
    var addChart = function(){

    };
    return {
        processData: processData,
        addChart: addChart
    };
})();