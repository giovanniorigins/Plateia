angular
    .module('coupon')
    .controller("IndexController", function ($scope, Coupon, AppData, supersonic) {
        $scope.ADappState = AppData.AppState;
        $scope.coupons = null;
        $scope.showSpinner = true;

        // Bind Shopping List
        $scope.couponList = angular.isDefined(localStorage.Coupon_list)
            ? JSON.parse(localStorage.Coupon_list)
            : [];
        supersonic.bind($scope, "couponList");

        Coupon.findAll().then(function (coupons) {
            $scope.$apply(function () {
                $scope.coupons = coupons;
                $scope.showSpinner = false;
            });
        });

        var options = {
            side: "right",
            width: 300
        };

        supersonic.ui.drawers.init("drawers#categoryJump", options);
        $scope.categoryJump = function () {
            supersonic.ui.drawers.open("right").then( function() {
                supersonic.logger.debug("Drawer was shown");
            });

            // You can also pass in a started View
            /*supersonic.ui.views.find("categoryJumper").then( function(categoryJumper) {
             supersonic.ui.drawers.init(categoryJumper, options);
             });*/
        };

        $scope.toCart = function (deal) {
            if (angular.isDefined(localStorage.Coupon_list)) {
                $scope.couponList = JSON.parse(localStorage.Coupon_list);
                    if ($scope.couponList.indexOf(deal.id) != -1) {
                    // Remove from list
                    $scope.couponList.splice($scope.couponList.indexOf(deal.id), 1);
                } else {
                    // Add to list
                    $scope.couponList.push(deal.id);
                }
                localStorage.Coupon_list = JSON.stringify($scope.couponList);

            } else {
                localStorage.Coupon_list = JSON.stringify([deal.id]);
            }
        };

        $scope.inCart = function (deal) {
            if (angular.isDefined(localStorage.Coupon_list)) {
                var couponList = JSON.parse(localStorage.Coupon_list);
                return couponList.indexOf(deal.id) != -1;
            } else {
                return false;
            }
        };
    });