angular.module('home')
    .controller('SettingsController', ['$scope', '$timeout', 'supersonic', '$http',
        function ($scope, $timeout, supersonic, $http) {
            //console.log($scope.ADappState.AllowPush);
            $scope.toggles = {
                enablePush: $scope.ADappState.AllowPush,
                enableGeo: $scope.ADappState.AllowGeo
            };

            /* Open Modals */
            $scope.openModal = function (name) {
                supersonic.logger.log('Loading Modal');
                var modalView,
                    options = {navigationBar: true};
                switch (name) {
                    case 'privacy':
                        modalView = new supersonic.ui.View('views/policies/privacy.tpl.html');
                        supersonic.ui.modal.show(modalView, options);
                        break;
                    case 'service':
                        modalView = new supersonic.ui.View('views/policies/TOS.tpl.html');
                        supersonic.ui.modal.show(modalView, options);
                        break;
                    case 'login':
                        modalView = new supersonic.ui.View('views/login-aside.tpl.html');
                        supersonic.ui.modal.show(modalView, options);
                        break;
                    case 'register':
                        modalView = new supersonic.ui.View('views/register-aside.tpl.html');
                        supersonic.ui.modal.show(modalView, options);
                        break;
                    case 'filter':
                        modalView = new supersonic.ui.View('views/filter-aside.tpl.html');
                        supersonic.ui.modal.show(modalView, options);
                        break;
                }
            };

            $scope.toggle = function (type) {
                switch (type) {
                    case 'push':
                        $timeout(function () {
                            localStorage.Allow_Push = JSON.stringify($scope.ADappState.AllowPush = $scope.toggles.enablePush);
                        }, 0);
                        break;
                    case 'geo':
                        $timeout(function () {
                            localStorage.Allow_Geo = JSON.stringify($scope.ADappState.AllowGeo = $scope.toggles.enableGeo);
                            if ($scope.toggles.enableGeo === false)
                                supersonic.ui.dialog.alert({
                                    title: 'Heads Up!',
                                    options: {
                                        message: 'This will disable use of the store locations map.'
                                    }
                                });
                        }, 0);
                        break;
                }
            };

            $scope.login_FB = function () {
                // Check whether Cordova plugin is enabled
                if (typeof FB !== 'undefined' && typeof CDV !== 'undefined') {
                    // Initialize Facebook Javascript SDK with Cordova interface
                    FB.init({
                        appId: 237722189734886,
                        nativeInterface: CDV.FB
                    });

                    FB.login(function (login) {
                        // Check if login was successful
                        if (login.authResponse) {
                            FB.api('/me', 'get', {
                                fields: 'first_name'
                            }, function (user) {
                                // Check if API request was successful
                                if (user && !user.error) {
                                    navigator.alert('Hello, ' + user.first_name + '!');
                                }
                            });
                        }
                    }, {
                        // Make sure we don't request extra access rights
                        scope: ''
                    });
                }
            };

            $scope.login_TW = function () {
                // Check whether Cordova plugin is enabled
                if (typeof OAuth !== 'undefined') {
                    // Initialize plugin with public key
                    OAuth.initialize("qweASD-zxcRTY_fghVBN-uioJKL");
                    // Always launch authentication popup
                    OAuth.popup('twitter', function (error, provider) {
                        // Check whether authentication was successful
                        if (!error && provider) {
                            provider.get('/1.1/account/verify_credentials.json')
                                .done(function (user) {
                                    navigator.alert('Hello, ' + user.name + '!');
                                });
                        }
                    });
                }
            };

            // Start Welcome Tour
            $scope.startWelcome = function () {
                $scope.openWelcome();
            };

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