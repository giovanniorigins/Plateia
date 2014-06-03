var updateConnection = function() {
    intel.xdk.device.updateConnection();
    var response = function (a) {
        debugger;
        return intel.xdk.device.connection;
    }
    document.addEventListener("intel.xdk.device.connection.update", response, false);
}
