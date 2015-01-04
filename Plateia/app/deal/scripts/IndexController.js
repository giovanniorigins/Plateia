angular
    .module('deal')
    .controller("IndexController", ['$scope', 'Deal', 'supersonic', function ($scope, Deal, supersonic) {
        $scope.deals = null;
        $scope.showSpinner = true;
        ProgressIndicator.showSimpleWithLabel(false, 'Loading...');
        $scope.search = '';

        /* NAVIGATION */
        supersonic.ui.navigationBar.setClass("green-bar");
        var settingsBtn = new steroids.buttons.NavigationBarButton();
        settingsBtn.imagePath = "/images/icons/filter@2x.png";
        settingsBtn.imageAsOriginal = "true";
        //settingsBtn.title = "Settings";
        settingsBtn.onTap = function() {
            $scope.categoryJump();
        };

        steroids.view.navigationBar.update({
            title: 'Deals',
            buttons: {
                right: [settingsBtn]
            }
        });
        /* //NAVIGATION */

        // Superscope Bindings
        $scope.selectedCategory = '';
        supersonic.bind($scope, "selectedCategory");

        $scope.shoppingList = angular.isDefined(localStorage.Shopping_list) ? JSON.parse(localStorage.Shopping_list) : [];
        supersonic.bind($scope, "shoppingList");

        Deal.findAll().then(function (deals) {
            supersonic.logger.log("completed");
            $scope.$apply(function () {
                $scope.deals = deals;
                localStorage.deals = JSON.stringify(deals);
                $scope.showSpinner = false;
                ProgressIndicator.hide();
            });
        }, function (error) {
            supersonic.logger.error("something wrong...");
            supersonic.logger.error(error);
            $scope.deals = JSON.parse(localStorage.deals);
            $scope.showSpinner = false;
            ProgressIndicator.hide();
        });

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


        var options = {
            side: "right",
            width: 300
        };

        supersonic.ui.drawers.init("drawers#categoryJump", options);
        $scope.categoryJump = function () {
            supersonic.ui.drawers.open("right").then(function () {
                supersonic.logger.debug("Drawer was shown");
            });
        };

        $scope.inCart = function (deal) {
            if (angular.isDefined(localStorage.Shopping_list)) {
                var shoppingList = JSON.parse(localStorage.Shopping_list);
                return shoppingList.indexOf(deal.id) != -1;
            } else {
                return false;
            }
        };

        $scope.share = function (deal) {
            window.plugins.socialsharing.iPadPopupCoordinates = function () {
                var rect = document.getElementById('share_' + deal.id).getBoundingClientRect();
                return rect.left + "," + rect.top + "," + rect.width + "," + rect.height;
            };
            window.plugins.socialsharing.share(
                'Check out this deal!', //message
                'Agora App: ' + deal.title, //subject
                deal.photos[0].path, //image
                'http://marketplace.gorigins.com/' //link
            );
        };

    }]);