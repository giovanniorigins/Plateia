angular
    .module('deal')
    .controller('ModalmapController', ['$scope', 'supersonic', '$timeout', '$window', function ($scope, supersonic, $timeout, $window) {

        $scope.locations = JSON.parse(steroids.view.params.locations);
        $scope.markerString = '';
        $scope.viewWidth = $window.innerWidth;
        $scope.viewHeight = $window.innerHeight;

        var alphaStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        angular.forEach($scope.locations, function (a, b) {
            a.alpha = alphaStr.charAt(b);
            var string = '&markers=color:red%7Clabel:'+ a.alpha + '%7C' + a.lat + ',' + a.lng;
            $scope.markerString += string;
        });

        $scope.closeModal = function () {
            supersonic.ui.modal.hide();
        };

        var options = {
            height: 460,      // height of the map (width is always full size for now)
            diameter: 1000,   // unused for now
            atBottom: true,   // bottom or top of the webview
            lat: 49.281468,   // initial camera position latitude
            lon: -123.104446  // initial camera position latitude
        };

        $scope.tryMap = function () {
            var mapOptions = {
                center: new google.maps.LatLng(-34.397, -77.676358),
                zoom: 8
            };

            var map = new google.maps.Map(document.getElementsByClassName("content"),
                mapOptions);

            google.maps.event.addDomListener(window, 'load', initialize);

            /*
                var map;
                var div = document.getElementById("map_canvas");
                map = plugin.google.maps.Map.getMap(div);
                $timeout(function () {
                    map.showDialog();
                }, 100);*/
        };

        $scope.app = {
            showMap: function() {
                var pins = [
                    {
                        lat: 49.28115,
                        lon: -123.10450,
                        title: "A Cool Title",
                        snippet: "A Really Cool Snippet",
                        icon: $window.mapKit.iconColors.HUE_ROSE
                    },
                    {
                        lat: 49.27503,
                        lon: -123.12138,
                        title: "A Cool Title, with no Snippet",
                        icon: {
                            type: "asset",
                            resource: "www/img/logo.png", //an image in the asset directory
                            pinColor: $window.mapKit.iconColors.HUE_VIOLET //iOS only
                        }
                    },
                    {
                        lat: 49.28286,
                        lon: -123.11891,
                        title: "Awesome Title",
                        snippet: "Awesome Snippet",
                        icon: $window.mapKit.iconColors.HUE_GREEN
                    }];
                var error = function() {
                    console.log('error');
                };
                var success = function() {
                    $window.mapKit.addMapPins(pins, function() {
                            console.log('adMapPins success');
                        },
                        function() { console.log('error'); });
                };
                $window.mapKit.showMap(success, error);
            },
            hideMap: function() {
                var success = function() {
                    console.log('Map hidden');
                };
                var error = function() {
                    console.log('error');
                };
                $window.mapKit.hideMap(success, error);
            },
            clearMapPins: function() {
                var success = function() {
                    console.log('Map Pins cleared!');
                };
                var error = function() {
                    console.log('error');
                };
                $window.mapKit.clearMapPins(success, error);
            },
            changeMapType: function() {
                var success = function() {
                    console.log('Map Type Changed');
                };
                var error = function() {
                    console.log('error');
                };
                $window.mapKit.changeMapType($window.mapKit.mapType.MAP_TYPE_SATELLITE, success, error);
            }
        }

    }]);