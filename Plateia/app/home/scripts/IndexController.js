angular.module('home')
    .controller('IndexController', ['$scope', 'supersonic', function ($scope, supersonic) {
        $scope.App = {};

        supersonic.device.platform().then(function (platform) {
            supersonic.logger.log(
                "Name: " + platform.name + " | " +
                "Version: " + platform.version + " | " +
                "Model: " + platform.model
            );
            $scope.App.Platform = platform;
        });

        document.addEventListener("visibilitychange", function () {
            supersonic.ui.navigationBar.setClass("home");
        }, false);

        /* NAVIGATION */
        steroids.view.navigationBar.show({
            titleImagePath: "/images/agora2_header.png",
            animated: true
        });

        var settingsBtn = new steroids.buttons.NavigationBarButton();
        settingsBtn.imagePath = "/images/icons/tools@2x.png";
        settingsBtn.imageAsOriginal = "true";
        //settingsBtn.title = "Settings";
        settingsBtn.onTap = function() {
            $scope.goTo('settings');
        };

        steroids.view.navigationBar.update({
            titleImagePath: "/images/agora2_header.png",
            buttons: {
                right: [settingsBtn]
            }
        });

        /* <div>Icon made by <a href="http://www.google.com" title="Google">Google</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></div> */
        /* //NAVIGATION */

        $scope.goTo = function (link) {
            //ProgressIndicator.showSimpleWithLabel(false, 'Loading...');
            var view;
            switch (link) {
                case 'deals':
                    view = new supersonic.ui.View({id:"deals", location: "deal#index"});
                    supersonic.ui.navigationBar.setClass("green-bar");
                    view.start().then(function () {
                        supersonic.ui.layers.push(view);
                        //ProgressIndicator.hide();
                    });
                    break;
                case 'coupons':
                    view = new supersonic.ui.View({id:"coupons", location: "coupon#index"});
                    supersonic.ui.navigationBar.setClass("purple-bar");
                    view.start().then(function () {
                        supersonic.ui.layers.push(view);
                        //ProgressIndicator.hide();
                    });
                    break;
                case 'stores':
                    view = new supersonic.ui.View({id:"stores", location: "shop#index"});
                    supersonic.ui.navigationBar.setClass("red-bar");
                    view.start().then(function () {
                        supersonic.ui.views.find("stores").then( function(startedView) {
                            supersonic.ui.layers.push(startedView);
                            //ProgressIndicator.hide();
                        });
                    });
                    break;
                case 'wishlist':
                    view = new supersonic.ui.View({id:"wishlist", location: "shoppinglist#index"});
                    supersonic.ui.navigationBar.setClass("blue-bar");
                    view.start().then(function () {
                        supersonic.ui.views.find("wishlist").then( function(startedView) {
                            supersonic.ui.layers.push(startedView);
                            //ProgressIndicator.hide();
                        });
                    });
                    break;
                case 'settings':
                    supersonic.ui.views.find("settings").then( function(startedView) {
                        supersonic.ui.layers.push(startedView)
                    });
            }

        };

        $scope.$on('$destroy', function () {

        });

        $scope.addButtons = function () {
            imageButton = new steroids.buttons.NavigationBarButton();
            imageButton.imagePath = "/icons/plus.png";
            imageButton.imageAsOriginal = "true";
            imageButton.styleClass = "nav-button";
            imageButton.onTap = function () {
                var btns = {
                    right: [imageButton]
                };
                steroids.view.navigationBar.setButtons(btns);
            };
        };

        steroids.on('ready', function () {
            $scope.addButtons()
        });

        $scope.switchView = function (id) {
            supersonic.ui.layers.replace(id, {
                onSuccess:function(data){
                    supersonic.logger.log(data);
                    supersonic.ui.animate("curlDown").perform();
                },
                onFailure:function(error){
                    supersonic.logger.log(error);
                    supersonic.ui.animate("curlDown").perform();
                }
            });
        };


        // Welcome Functions
        /*var welcomed;
         $timeout(function () {
         if (angular.isUndefined(welcomed = localStorage.Welcomed) || welcomed == 'false') {
         $state.go('intro');
         }
         }, 0);*/
    }])
