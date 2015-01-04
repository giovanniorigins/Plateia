angular
    .module('shop')
    .controller("IndexController", function ($scope, Shop, supersonic) {
        $scope.shops = null;
        $scope.showSpinner = true;
        ProgressIndicator.showSimpleWithLabel(false, 'Loading...');

        $scope.fav = function (id) {
            if (angular.isDefined(localStorage.Faved_shops)) {
                var myShops = JSON.parse(localStorage.Faved_shops);
                _.contains(myShops, id) ? myShops.splice(myShops.indexOf(id), 1) : myShops.push(id);
                localStorage.Faved_shops = JSON.stringify(myShops);
            } else {
                localStorage.Faved_shops = JSON.stringify([id]);
            }
        };

        $scope.faved = function (id) {
            var favedShops = angular.isDefined(localStorage.Faved_shops)
                ? JSON.parse(localStorage.Faved_shops)
                : [];
            return _.contains(favedShops, id);
        };

        Shop.findAll().then(function (shops) {
            $scope.$apply(function () {
                $scope.shops = shops;
                $scope.showSpinner = false;
                ProgressIndicator.hide()
            });
        });
    });