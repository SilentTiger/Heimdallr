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
    var processData = function(msgEvent){
        var tmpData = eval( "(" + msgEvent.data + ")");
        //{"cmd":"monitorData","data":[{"id":"    7","data":{"cpu":"0.0","ram":"0.0"}}],"time":"2014-06-20T03:46:46.771Z"}
        if(tmpData.cmd !== "monitorData") return;
        for(var i = 0, l = tmpData.data.length; i < l; i++){
            var targetId = this.id + "|" + tmpData.data[i].id;
            if(needRecord[targetId]){
                data[targetId].push(tmpData.data[i].data);
            }
        }
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
    var getData = function(targetId){
        return data[targetId];
    };
    var getDataAll = function(){
        return data;
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
        getData: getData,
        getDataAll: getDataAll,
        delTarget: delTarget
    };
})();

var ChartManager = (function(){
    var charts = {}
    var processData = function(msgEvent){
        var tmpData = eval( "(" + msgEvent.data + ")");
        //{"cmd":"monitorData","data":[{"id":"    7","data":{"cpu":"0.0","ram":"0.0"}}],"time":"2014-06-20T03:46:46.771Z"}
        if(tmpData.cmd !== "monitorData") return;
        for(var i = 0, l = tmpData.data.length; i < l; i++){
            var targetId = this.id + "|" + tmpData.data[i].id;
            if(charts[targetId]){
                for(var name in tmpData.data[i].data){
                    for(var j = 0, m = charts[targetId].series.length; j < m; j++){
                        if(name === charts[targetId].series[j].name){
                            charts[targetId].series[j].addPoint([new Date(tmpData.time).getTime(), parseFloat(tmpData.data[i].data[name])] , true, true);
                        }
                    }
                }
            }
        }
    };
    var addChart = function(targetId, type){
        gridster.add_widget("<li style='background-color:rgb(97, 97, 97)'><div id='charId_" + targetId + "' style='height:100%'> </div></li>", 1, 1, 1, 1);
        var chart = new Highcharts.Chart({
            chart: {
                type: 'spline',
                renderTo: 'charId_' + targetId,
                animation: Highcharts.svg, // don't animate in old IE      
                marginRight: 10
            },        
            title: {  
                text: targetId
            },         
            xAxis: {   
                type: 'datetime',
                tickPixelInterval: 150
            },         
            yAxis: {
                title: {
                    text: 'Usage(%)'
                },   
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                min: 0,
                max: 100
            },         
            tooltip: { 
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+        
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }      
            },         
            legend: {  
                enabled: false
            },      
            series: [
                { 
                    name: 'cpu',
                    data: (function() {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;
                        for (i = -14; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: 0
                            });
                        }
                        return data;
                    })()
                },
                {
                    name: 'ram',
                    data: (function() {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;
                        for (i = -14; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: 0
                            });
                        }
                        return data;
                    })()
                }]
        });
        charts[targetId] = chart;
    };
    return {
        processData: processData,
        addChart: addChart
    };
})();