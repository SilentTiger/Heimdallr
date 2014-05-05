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

var ConnectionFactory = (function () {
    var connections = {};
    var getConnection = function(uri) {
        if (!connections[uri]) {
            var con = new WebSocket("ws://" + uri);
            con.addEventListener("close", function() {
                delete connections[uri];
            });
            connections[uri] = con;
        }
        return connections[uri];
    };
    return {
        getConnection: getConnection
    };
})();