angular.module('shoppinglist')
    .controller('IndexController', ['$scope', 'supersonic', function ($scope, supersonic) {
        $scope.deals = null;
        $scope.showSpinner = true;

        // Bind Shopping List
        $scope.shoppingList = angular.isDefined(localStorage.Shopping_list)
            ? JSON.parse(localStorage.Shopping_list)
            : [];
        supersonic.bind($scope, "shoppingList");

        if ($scope.shoppingList.length > 0) {

            var Deal = supersonic.data.model('Deal');
            Deal.findAll({ids: $scope.shoppingList}).then(function (deals) {
                $scope.$apply(function () {
                    $scope.deals = deals;
                    $scope.showSpinner = false;

                    var totalSavings = 0;
                    angular.forEach(deals, function (a) {
                        totalSavings += (a.list_price - a.new_price);
                    })
                });
            });
        } else {
            $scope.showSpinner = false;
            var totalSavings = 0;
        }

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

        $scope.inCart = function (deal) {
            if (angular.isDefined(localStorage.Shopping_list)) {
                var shoppingList = JSON.parse(localStorage.Shopping_list);
                return shoppingList.indexOf(deal.id) != -1;
            } else {
                return false;
            }
        };
    }]);