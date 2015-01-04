angular.module('home')
    .controller('MystoresController', ['$scope', 'supersonic',
        function ($scope, supersonic) {
            $scope.shops = [];

            var Shop = supersonic.data.model('Shop');
            Shop.all().whenChanged( function (shops) {
                $scope.$apply( function () {
                    $scope.shops = shops;
                });
            });

            var myShops = angular.isDefined(localStorage.Faved_shops)
                ? JSON.parse(localStorage.Faved_shops)
                : [];
            $scope.checkSelected = function (shop) {
                return shop.checked = myShops.indexOf(shop.id) != -1
            };

            /*$scope.doRefresh = function () {
             $scope.Shops.length = 0;
             Shop.refresh(function(data){
             $scope.Shops = data;

             myShops = angular.isDefined(localStorage.Faved_shops)
             ? JSON.parse(localStorage.Faved_shops).toString()
             : '';
             angular.forEach($scope.shops, function(v){
             v.checked = myShops.indexOf(v.id) != -1;
             });

             $scope.$broadcast('scroll.refreshComplete');
             }, function(data){
             $scope.$broadcast('scroll.refreshComplete');
             alert('Check Internet Connection.')
             });
             };*/

            $scope.selectedShop = function (shop) {
                if (angular.isDefined(localStorage.Faved_shops)) {
                    var favedShops = JSON.parse(localStorage.Faved_shops);
                    _.contains(favedShops, shop.id) ? favedShops.splice(favedShops.indexOf(shop.id), 1) : favedShops.push(shop.id);
                    localStorage.Faved_shops = JSON.stringify(favedShops);
                } else {
                    localStorage.Faved_shops = JSON.stringify([shop.id])
                }
                return true;
            };

            $scope.shopShare = function (shop) {
                $scope.openShare(shop);
            };

            // Request a Store
            $scope.RequestPrompt = function () {
                var options = {
                    title: "What store would you like to see on Agora App?",
                    buttonLabels: ["Cancel", "Send"],
                    defaultText: ""
                };

                supersonic.ui.dialog.prompt("What store would you like to see on Agora App?", options).then(function (result) {
                    supersonic.logger.log("User clicked button number " + result.buttonIndex + " with text " + result.input);

                    if (result.buttonIndex == 1) {
                        ProgressIndicator.showDeterminateWithLabel(false, 50000, 'Requesting' + result.input);

                        // Create the Task Model class
                        var Request = supersonic.data.model("Request");

                        var req = new Request({
                            request: 'store',
                            text: result.input
                        });
                        req.save().then( function(res) {
                            supersonic.logger.log("completed");
                            supersonic.logger.log('Store Requested');
                            ProgressIndicator.hide();
                            ProgressIndicator.showSuccess(false, 'Store Requested');
                            $timeout(function () {
                                ProgressIndicator.hide();
                            }, 1000);
                        }, function(error) {
                            supersonic.logger.error("something wrong...");
                            supersonic.logger.error(error);
                            ProgressIndicator.hide();
                        });

                    }
                });
            }
        }
    ]);