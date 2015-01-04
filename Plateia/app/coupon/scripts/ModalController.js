angular
    .module('coupon')
    .controller('ModalController', ['$scope', '$timeout', 'supersonic', 'Coupon', function ($scope, $timeout, supersonic, Coupon) {
        $scope.state = 'main';
        $scope.showSpinner = true;
        $scope.coupon = null;

        // Bind Shopping List
        $scope.couponList = angular.isDefined(localStorage.Coupon_list)
            ? JSON.parse(localStorage.Coupon_list)
            : [];
        supersonic.bind($scope, "couponList");

        // Fetch an object based on id from the database
        Coupon.find(steroids.view.params.id).then( function (coupon) {
            $scope.$apply(function() {
                $scope.coupon = coupon;
                $scope.showSpinner = false;
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

        $scope.toCart = function (coupon) {
            if (angular.isDefined(localStorage.Coupon_list)) {
                $scope.couponList = JSON.parse(localStorage.Coupon_list);
                if ($scope.couponList.indexOf(coupon.id) != -1) {
                    // Remove from list
                    $scope.couponList.splice($scope.couponList.indexOf(coupon.id), 1);
                } else {
                    // Add to list
                    $scope.couponList.push(coupon.id);
                }
                localStorage.Coupon_list = JSON.stringify($scope.couponList);

            } else {
                localStorage.Coupon_list = JSON.stringify([coupon.id]);
            }
        };

        $scope.inCart = function(coupon) {
            if (angular.isDefined(localStorage.Coupon_list)) {
                var couponList = JSON.parse(localStorage.Coupon_list);
             return couponList.indexOf(coupon.id) != -1;
             } else {
             return false;
             }
        };

        $scope.saving = function (coupon) {
            return coupon.list_price - coupon.new_price;
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {

        });

        $scope.share = function (coupon) {
            window.plugins.socialsharing.iPadPopupCoordinates = function() {
                var rect = document.getElementById('share_button').getBoundingClientRect();
                return rect.left + "," + rect.top + "," + rect.width + "," + rect.height;
            };
            window.plugins.socialsharing.share(
                'Check out this coupon!', //message
                'Agora App: ' + coupon.title, //subject
                coupon.photos[0].path, //image
                'http://marketplace.gorigins.com/' //link
            );
        };
    }]);
