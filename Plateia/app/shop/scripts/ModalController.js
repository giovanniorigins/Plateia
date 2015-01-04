angular
    .module('shop')
    .controller('ModalController', ['$scope', '$timeout', 'supersonic', 'Shop', function ($scope, $timeout, supersonic, Shop) {
        $scope.showSpinner = true;
        ProgressIndicator.showSimpleWithLabel(false, 'Loading...');
        $scope.shop = null;

        // Bind Shopping List
        $scope.shoppingList = angular.isDefined(localStorage.Shopping_list)
            ? JSON.parse(localStorage.Shopping_list)
            : [];
        supersonic.bind($scope, "shoppingList");

        // Fetch an object based on id from the database
        Shop.find(steroids.view.params.id).then( function (shop) {
            $scope.$apply(function() {
                $scope.shop = shop;
                $scope.showSpinner = false;
                ProgressIndicator.hide();
            });
        });

        $scope.toExpire = function (date) {
            return moment(date).fromNow();
        };

        $scope.toDate = function (date) {
            return moment(date).toDate();
        };

        $scope.closeModal = function () {
            supersonic.ui.modal.hide();
        };

        $scope.faved = function (id) {
            var favedShops = angular.isDefined(localStorage.Faved_shops)
                ? JSON.parse(localStorage.Faved_shops)
                : [];
            return _.contains(favedShops, id);
        };

        $scope.favShop = function (id) {
            if (angular.isDefined(localStorage.Faved_shops)) {
                var myShops = JSON.parse(localStorage.Faved_shops);
                _.contains(myShops, id) ? myShops.splice(myShops.indexOf(id), 1) : myShops.push(id);
                localStorage.Faved_shops = JSON.stringify(myShops);
            } else {
                localStorage.Faved_shops = JSON.stringify([id]);
            }
        };

        $scope.inCart = function (deal) {
            var shoppingList = angular.isDefined(localStorage.Shopping_list)
                ? JSON.parse(localStorage.Shopping_list)
                : [];
            return _.contains(shoppideal.ngList, id);
        };

        $scope.toCart = function (deal) {
            if (angular.isDefined(localStorage.Shopping_list)) {
                $scope.shoppingList = JSON.parse(localStorage.Shopping_list);
                if ($scope.shoppingList.indexOf(deal.id) != -1) {
                    // Remove from list
                    $scope.shoppingList.splice($scope.shoppingList.indexOf(deal.id), 1);
                } else {
                    // Add to list
                    $scope.shoppingList.push(deal.id);
                }
                localStorage.Shopping_list = JSON.stringify($scope.shoppingList);
            } else {
                localStorage.Shopping_list = JSON.stringify([deal.id]);
            }
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {

        });
    }]);
