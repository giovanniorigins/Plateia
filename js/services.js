function strict() {
    'use strict';
}

var Marketplace = angular.module('plateia', [
    'ngRoute',
    //'ngAnimate',
    //'google-maps',
    'angular-tour',
    'ngResource',
    'ngDreamFactory',
    'pasvaz.bindonce',
    'rn-lazy',
    'jmdobry.angular-cache',
    'ionic',
    'ui.router',
    'ui.router.stateHelper',
    'plateia.filters',
    'plateia.services',
    'plateia.directives',
    'plateia.controllers'
]);

Marketplace.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('intro', {
                    url: "/intro",
                    templateUrl: 'partials/intro.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 0
                })
                .state('index', {
                    //parent: 'nav',
                    url: '/index',
                    templateUrl: 'partials/sales.html',
                    controller: function () {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve,
                    },
                    depth: 1
                })
                .state('shoppingList', {
                    //parent: 'nav',
                    url: '/shopping-list',
                    templateUrl: 'partials/shopping-list.html',
                    controller: function () {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve,
                    },
                    depth: 1
                })
                .state('search', {
                    //parent: 'nav',
                    url: '/search',
                    templateUrl: 'partials/search.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 2
                })
                .state('categories', {
                    //parent: 'nav',
                    url: '/categories',
                    templateUrl: 'partials/categories.html',
                    controller: function ($scope, AppData, Categories) {
                        console.log('categories route controller...');
                        $scope.ADarrays.Categories = AppData.Arrays.Categories = Categories;
                    },
                    resolve: {
                        //GetAppData: AppData.resolve,
                        Categories: function (myService) {
                            return myService.getCategories();
                        }
                    },
                    depth: 1
                })
                .state('category', {
                    //parent: 'categories',
                    url: '/categories/:catAlias',
                    templateUrl: 'partials/category.html',
                    controller: function ($scope, AppData, Deals) {
                        $scope.deals = Deals;
                    },
                    resolve: {
                        //GetAppData: AppData.resolve,
                        Deals: function ($rootScope, myService, AppData) {
                            return myService.getDealsByCategoryId($rootScope.activeCategory.id);
                        }
                    },
                    depth: 2
                })
                .state('notifications', {
                    //parent: 'nav',
                    url: '/notifications',
                    templateUrl: 'partials/activity.html', // 'partials/notifications.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 1
                })
                .state('activity', {
                    //parent: 'nav',
                    url: '/activity',
                    templateUrl: 'partials/activity.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 1
                })
                .state('invite', {
                    //parent: 'nav',
                    url: '/invite',
                    templateUrl: 'partials/invite.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 1
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'partials/settings.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 1
                })
                .state('settings-shops', {
                    //parent: 'nav',
                    url: '/settings/shops',
                    templateUrl: 'partials/settings-shops.html',
                    controller: function ($scope, Shops) {
                        $scope.Shops = Shops;
                    },
                    resolve: {
                        Shops: function (Shop) {
                            return Shop.get();
                        }
                    },
                    depth: 2
                })
                /*.state('shop', {
                 //parent: 'shops',
                 url: '/shops/:shopAlias',
                 templateUrl: 'partials/shop_detail.html',
                 controller: function ($scope, Shop) {
                 $scope.deals = Shop.deals;
                 },
                 resolve: {
                 //GetAppData: AppData.resolve,
                 Shop: function ($rootScope, myService) {
                 return myService.getShopById($rootScope.activeShop.id)
                 }
                 },
                 depth: 2
                 })
                 .state('shop_details', {
                 //parent: 'shop',
                 url: '/shops/:shopAlias/details',
                 templateUrl: 'partials/shop_details.html',
                 controller: function ($scope) {
                 },
                 resolve: {
                 //GetAppData: AppData.resolve
                 },
                 depth: 3
                 })*/
                .state('help', {
                    //parent: 'nav',
                    url: '/help',
                    templateUrl: 'partials/help.html',
                    controller: function ($scope) {
                    },
                    resolve: {
                        //GetAppData: AppData.resolve
                    },
                    depth: 1
                });

            $urlRouterProvider.otherwise("/index");

        }])
    .constant('DSP_URL', 'https://dsp-gorigins.cloud.dreamfactory.com')
    .constant('DSP_API_KEY', 'Marketplace')
    .config(['$httpProvider', 'DSP_API_KEY',
        function ($httpProvider, DSP_API_KEY) {
            $httpProvider.defaults.headers.common['X-DreamFactory-Application-Name'] = DSP_API_KEY;
        }]);

angular.module('plateia.services', [])
    .value('version', '2.0')
    .factory('NavItems', function () {
        return [
            {
                "name": "Home",
                "url": "#/",
                "class": "ion-home"
            },
            {
                "name": "Shops",
                "url": "#/shops",
                "class": "ion-bag"
            },
            {
                "name": "Categories",
                "url": "#/categories",
                "class": "ion-filing"
            },
            {
                "name": "Notifications",
                "url": "#/activity",
                "class": "ion-ios7-bell"
            },
            {
                "name": "Settings",
                "url": "#/settings",
                "class": "ion-gear-a"
            },
            {
                "name": "Help",
                "url": "#/help",
                "class": "ion-help"
            }
        ];
    })
    .factory('ServiceData', ['DSP_URL', 'DSP_API_KEY', function (DSP_URL, DSP_API_KEY) {
        "use strict";
        return {
            DB: DSP_URL + '/rest/db',
            Files: DSP_URL + '/rest/files/applications/' + DSP_API_KEY,
            CouponImages: DSP_URL + '/rest/files/applications/' + DSP_API_KEY + '/images/coupons/?include_files=true',
            Requests: DSP_URL + '/rest/'
        };
        // Usefull Things to remember
        // https://dsp-gorigins.cloud.dreamfactory.com/rest/db/coupons?related=shop_by_shop_id%2Ccategories_by_category_id
    }])
    .factory('AppData', function () {
        return {
            AppState: {
                currentName: 'Agora',
                previousName: '',
                currentApp: 'home',
                previousApp: '',
                Type: intel.xdk.isphone ? 'isPhone' : intel.xdk.istablet ? 'isTablet' : 'isTablet',
                Orientation: intel.xdk.device.orientation == "90" || intel.xdk.device.orientation == "-90" ? 'landscape' : 'portrait',
                Platform: intel.xdk.device.platform,
                Connection: intel.xdk.device.connection,
                AllowGeo: intel.xdk.cache.getCookie('Allow_Geo') == 'true' || false,
                AllowPush: intel.xdk.cache.getCookie('Allow_Push') == 'true' || false,
                deviceType: intel.xdk.isphone ? 'isPhone' : 'isTablet'
            },
            User: null,
            UserCreds: {
                prevent_csrf: 0,
                username: '',
                password: ''
            },
            SearchData: {
                search: '',
                results: []
            },
            Arrays: {
                Categories: [],
                Deals: [],
                Shops: []
            },
            Counts: {
                Deals: 0,
                Shops: 0
            },
            ActiveCategory: {},
            ActiveShop: {},
            ActiveDeal: {}

        };
    })
    .factory('Request', ['$resource', 'ServiceData', function ($resource, ServiceData) {
        "use strict";
        return $resource(ServiceData.DB + '/request/');
    }])
    .factory('Issue', ['$resource', 'ServiceData', function ($resource, ServiceData) {
        "use strict";
        return $resource(ServiceData.DB + '/issues/:id/?fields=*&ids=:ids&order=shop_id%20ASC&related=shop_by_shop_id%2Cdeals_by_issue_id&id_field=shop_id&continue=true', {},
            {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET', isArray: false
                },
                refresh: {
                    method: 'GET', cache: false
                }
            }
        );
    }])
    .factory('Category', ['$resource', 'ServiceData',
        function ($resource, ServiceData) {
            "use strict";
            return $resource(ServiceData.DB + '/categories/:id/?fields=*&related=deals_by_category_id%2Cshops_by_deal', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET', isArray: false
                },
                refresh: {
                    method: 'GET', cache: false
                }
            });
        }])
    .factory('Shop', ['$resource', 'ServiceData', function ($resource, ServiceData) {
        "use strict";
        return $resource(ServiceData.DB + '/shop/:id/?fields=*&related=deals_by_shop_id%2Cissues_by_shop_id', {},
            {
                update: {
                    method: 'PUT' },
                query: {
                    method: 'GET', isArray: false
                },
                refresh: {
                    method: 'GET', cache: false
                }
            });
    }])
    .factory('Deal', ['$resource', 'ServiceData', function ($resource, ServiceData) {
        "use strict";
        return $resource(ServiceData.DB + '/deal/:id/?fields=*&ids=:ids&order=id%20ASC&related=shop_by_shop_id%2Ccategories_by_category_id%2Cissues_by_issue_id', {},
            {
                update: {
                    method: 'PUT', url: ServiceData.DB + '/deal/:id/?fields=*' },
                query: {
                    method: 'GET', isArray: false
                },
                refresh: {
                    method: 'GET', cache: false
                }
            });
    }])
    .factory('Coupon', ['$resource', 'ServiceData',
        function ($resource, ServiceData) {
            "use strict";
            return $resource(ServiceData.DB + '/coupons/:id/?fields=*&related=shop_by_shop_id%2Ccategories_by_category_id', {}, {
                update: {
                    method: 'PUT',
                    url: ServiceData.DB + '/coupons/:id/?fields=*'
                },
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        }])
    .factory('CouponImages', ['$resource', 'ServiceData',
        function ($resource, ServiceData) {
            "use strict";
            return $resource(ServiceData.CouponImages, {}, {
                create: {
                    method: 'POST',
                    url: ServiceData.Files + '/images/coupons/?check_exist=true',
                    params: {
                        url: '@url'
                    }
                },
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        }])
    .factory('cookieHandler', function () {
        return {
            saveShops: function (a, b) {
                if (angular.isDefined(intel.xdk.cache.getCookie('Faved_shops'))) {
                    var favedShops = [];
                    favedShops = JSON.parse(intel.xdk.cache.getCookie('Faved_shops'));
                    favedShops.indexOf(shop.id) != -1 ? favedShops.splice(favedShops.indexOf(shop.id), 1) : favedShops.push(shop.id);
                    intel.xdk.cache.setCookie('Faved_shops', JSON.stringify(favedShops), '-1');
                } else {
                    intel.xdk.cache.setCookie('Faved_shops', JSON.stringify([shop.id]), '-1');
                }
                return false;
            },
            get: function (a) {
                return true;
            }
        };
    })
    .factory('myService', ['$http', '$angularCacheFactory', 'AppData', '$q', '$filter', '$rootScope', '$resource', 'LoadingService',
        function ($http, $angularCacheFactory, AppData, $q, $filter, $rootScope, $resource, LoadingService) {
            var obj = {};

            $angularCacheFactory('apiCache', {
                storageMode: 'localStorage',
                maxAge: 360000, // Items added to this cache expire after 15 minutes.
                cacheFlushInterval: 600000, // This cache will clear itself every hour.
                deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
            });

            $http.defaults.cache = $angularCacheFactory.get('apiCache');
            // User Login
            obj.userLogin = function () {
                LoadingService.loading(false);
                var deferred = $q.defer();
                var args = AppData.UserCreds;

                if (args.username === '' || args.password === '') {
                    deferred.reject('Request Login');
                    LoadingService.loaded();
                    return deferred.promise;
                }

                $http.get(AppData.BaseURL + 'login/')
                    .success(function (data, status, headers, config) {
                        var pos = data.indexOf('prevent_csrf');

                        args.prevent_csrf = data.substring(pos + 21, pos + 31);

                        $http.post(AppData.BaseURL + 'login/',
                            $.param(args), {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            })
                            .success(function (data, status, headers, config) {
                                // Successful Login
                                var promise = obj.checkStatus();
                                promise.then(function (success) {
                                    var checkLogin = obj.checkLogin(args);
                                    deferred.resolve(true);

                                }, function (failure) {
                                    console.log(failure);
                                    deferred.reject('Failed to Login. Please try again later.');
                                });
                            })
                            .error(function (data, status, headers, config) {
                                alert('Failed to login, check credentials.');
                                deferred.reject('Failed to login, check credentials.');
                                return deferred.promise;
                            });
                    })
                    .error(function (data, status, headers, config) {
                        alert('Failed to connect, check connection.');
                        deferred.reject('Failed to connect, check connection.');
                        return deferred.promise;
                    });

                LoadingService.loaded();
                return deferred.promise;
            };

            // Check Login Status
            obj.checkStatus = function () {
                var deferred = $q.defer();

                $http.get(AppData.API.Users + 'status.json', {
                    cache: false
                })
                    .success(function (data, status, headers, config) {
                        console.log('Logged in: ', data.status);
                        if (data.status === true)
                            deferred.resolve(data.status);
                        else
                            deferred.reject(data.status);
                    })
                    .error(function (data, status, headers, config) {
                        alert('Failed to connect, check connection.');
                    });
                return deferred.promise;
            };

            // Get User Data
            obj.getUserData = function () {
                LoadingService.loading(false);
                var deferred = $q.defer();

                $http.get(AppData.API.Users + 'me.json', {
                    cache: false
                })
                    .success(function (data, status, headers, config) {
                        if (data.user !== null) {
                            AppData.User = data.user;

                            // Save login info to cookie
                            intel.xdk.cache.setCookie('User_Login', JSON.stringify({
                                'username': AppData.UserCreds.username,
                                'password': AppData.UserCreds.password
                            }), '-1');
                            deferred.resolve(data.user);
                        } else {
                            deferred.reject(data.user);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        alert('Failed to connect, check connection.');
                    });
                LoadingService.loaded();
                return deferred.promise;
            };

            // Test Login
            obj.checkLogin = function (args) {
                LoadingService.loading(false);
                var deferred = $q.defer();

                // Check for neccessary login data
                //check if cookie exists
                if (angular.isDefined(intel.xdk.cache.getCookie('User_Login'))) {

                    var cookieArgs = JSON.parse(intel.xdk.cache.getCookie('User_Login'));

                    // check for none empty args
                    if (cookieArgs.username === '' || cookieArgs.password === '') {
                        //deferred.reject('Request Login');
                        LoadingService.loaded();
                        return deferred.promise;
                    } else {
                        args = cookieArgs;
                    }

                }

                // Check Login Status
                var statusPromise = obj.checkStatus();
                statusPromise.then(function (isLogged) { // Is Logged In
                    $http.get(AppData.API.Users + 'me.json', {
                        cache: false
                    })
                        .success(function (data) { // Connection Successful
                            // Logged in
                            AppData.User = data.user;

                            // Save login to cookie
                            intel.xdk.cache.setCookie('User_Login', JSON.stringify({
                                'username': AppData.UserCreds.username,
                                'password': AppData.UserCreds.password
                            }), '-1');

                            deferred.resolve(data.user);
                            LoadingService.loaded();
                        })
                        .error(function (data, status, headers, config) {
                            alert('Failed to connect, check connection.');
                        });
                }, function (notLogged) { // Is Not Logged In

                    //if (data.user === null) { // Not logged in yet, try to...

                    var promise = obj.userLogin(args);
                    promise.then(function (success) {
                        alert('Success: ' + success);
                    }, function (failure) {
                        //alert('Failed: ' + failure);
                        deferred.reject(failure);
                    }, function (update) {
                        alert('Got notification: ' + update);
                    });

                    //}

                });

                LoadingService.loaded();
                return deferred.promise;
            };

            // Process Login
            obj.processLogin = function (auto) {
                LoadingService.loading(false);
                var deferred = $q.defer();

                // Check auto definition
                auto = angular.isUndefined(auto) ? false : auto;

                //Check Login Status
                var checkStatus = obj.checkStatus();
                checkStatus.then(function (status) {
                        //// Status: Is Logged In

                        /// Get and Set User Data
                        var getUserData = obj.getUserData();
                        getUserData.then(function (data) {
                            deferred.resolve(data.user);
                        });
                    },
                    function (status) {
                        //// Status: Not Logged In
                        if (!auto) {
                            /// Attempt Login
                            var userLogin = obj.userLogin(AppData.User);
                            userLogin.then(function (success) {
                                // Successful Login
                                var finallyGetUserData = obj.getUserData();
                            }, function (failure) {
                                // Unsuccessful Login
                                deferred.reject('Request Login');
                            });
                        }


                    });


                LoadingService.loaded();
                return deferred.promise;
            };

            // Logout
            obj.userLogout = function () {
                LoadingService.loading(false);
                var deferred = $q.defer();

                $http.get(AppData.BaseURL + 'logout/', {
                    cache: false
                })
                    .success(function (data, status, headers, config) {
                        // Successful Logout
                        deferred.resolve('Successfully Logged Out');
                        AppData.User = null;
                    })
                    .error(function (data, status, headers, config) {
                        alert('Failed to logout, check connection.');
                    });

                LoadingService.loaded();
                return deferred.promise;
            };

            obj.thumbs = function (id, url, direction) {
                LoadingService.loading(true);
                var deferred = $q.defer();

                if (angular.isUndefined(id) || angular.isUndefined(url) || angular.isUndefined(direction)) {
                    deferred.reject('Missing arguments.');
                    LoadingService.loaded();
                    return deferred.promise;
                }

                url = url.replace('.html', '.json');
                $http.get(url + '?action=thumbs&id=' + id + '&trigger=' + direction, {
                    cache: false
                })
                    .success(function (data) {
                        if (!data.error) {
                            deferred.resolve(data.data);
                        } else {
                            deferred.reject(data.msg);
                        }
                    });

                LoadingService.loaded();
                return deferred.promise;

            };

            return obj;
        }])
    .factory('LoadingService', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                loading: function (background) {
                    background = angular.isDefined(background) ? background : true;
                    intel.xdk.notification.showBusyIndicator();
                },
                loaded: function () {
                    $timeout(function () {
                        intel.xdk.notification.hideBusyIndicator();
                    }, 800);
                }
            };
        }])
    .factory('SearchEngine', ['$rootScope', 'myService', 'AppData',
        function ($rootScope, myService, AppData) {
            $rootScope.searchData = AppData.SearchData;
            return {
                deals: function (args, cache) {
                    myService.getDealsBySearch(args)
                        .then(function (data) {
                            $rootScope.searchData.results = data;
                        });
                },
                shops: function (args, cache) {
                    myService.getDealsBySearch(args)
                        .then(function (data) {
                            $rootScope.searchData.results = data;
                        });
                }

            };
        }])
    .factory('appReady', function () {
        return function (fn) {

            var queue = [];

            var impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

            document.addEventListener('deviceready', function () {
                queue.forEach(function (args, cache) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function () {
                return impl.apply(this, arguments);
            };
        };
    })
    .factory('PN', ['$rootScope', 'appReady',
        function ($rootScope, appReady) { // Push Notifications
            return {
                getNotificationList: function () {
                    var myNotifications = [];
                    var notifications = [];
                    $rootScope.safeApply(function () {
                        notifications = AppMobi.notification.getNotificationList().reverse();
                        var len = notifications.length;
                        if (len > 0) {
                            var strMessages = "";
                            for (var i = 0; i < len; i++) {
                                var msgObj = AppMobi.notification.getNotificationData(notifications[i]);
                                try {
                                    if (typeof msgObj == "object" && msgObj.id == notifications[i]) {
                                        myNotifications.push(msgObj);
                                    }
                                } catch (e) {
                                    alert("Invalid message object");
                                }
                            }
                            //alert( strMessages );
                            //console.log( myNotifications );
                        }
                        return myNotifications;
                    });
                    return myNotifications;
                }
            };
        }])
    .factory('Geolocation', ['$rootScope', 'appReady', '$q',
        function ($rootScope, appReady, $q) {
            return {
                getCurrentPosition: function (onSuccess, onError) {
                    var deferred = $q.defer();
                    if (angular.isUndefined(onSuccess)) {
                        onSuccess = function (a) {
                            deferred.resolve(a);
                        };
                    }
                    if (angular.isUndefined(onError)) {
                        onError = function (a) {
                            deferred.reject(a);
                        };
                    }
                    intel.xdk.geolocation.getCurrentPosition(function () {
                        var that = this,
                            args = arguments;

                        if (onSuccess) {
                            $rootScope.safeApply(function () {
                                onSuccess.apply(that, args);
                            });
                        }
                    }, function () {
                        var that = this,
                            args = arguments;

                        if (onError) {
                            $rootScope.safeApply(function () {
                                onError.apply(that, args);
                            });
                        }
                    });
                    return deferred.promise;
                }
            };
        }])
    .factory('Accelerometer', ['$rootScope', 'appReady',
        function ($rootScope, appReady) {
            return {
                getCurrentAcceleration: function (onSuccess, onError) {
                    intel.xdk.accelerometer.getCurrentAcceleration(function () {
                        var that = this,
                            args = arguments;

                        if (onSuccess) {
                            $rootScope.safeApply(function () {
                                onSuccess.apply(that, args);
                            });
                        }
                    }, function () {
                        var that = this,
                            args = arguments;

                        if (onError) {
                            $rootScope.safeApply(function () {
                                onError.apply(that, args);
                            });
                        }
                    });
                }
            };
        }])
    .factory('Social', ['$rootScope', 'appReady', '$q',
        function ($rootScope, appReady, $q) {
            var serviceName = 'Twitter1';
            return {
                // Facebook
                FBlogin: function (permissions) {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        intel.xdk.facebook.login(permissions);
                        document.addEventListener("intel.xdk.facebook.login", function (e) {
                            AppMobi.facebook.enableFrictionlessRequests();
                        }, false);
                    });

                    return deferred.promise;
                },
                FBlogout: function () {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        intel.xdk.facebook.logout();
                    });
                },
                FBrequestWithGraphAPI: function (path, method, parameters) {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        intel.xdk.facebook.requestWithGraphAPI(facebookUserID + "/friends", "GET", "");
                    });
                },
                FBshowNewsFeedDialog: function (objParameters) {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        //This allows you to post to your Facebook Wall
                        document.addEventListener("intel.xdk.facebook.dialog.complete", function (e) {
                            console.log("News Feed Event Returned");
                            if (e.success === true) {
                                console.log("News feed updated successfully");
                                deferred.resolve(e.success);
                            }
                        }, false);
                        intel.xdk.facebook.showNewsFeedDialog(objParameters);
                    });
                    return deferred.promise;
                },
                // Twitter
                Tlogin: function () {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        function twitterReady() {
                            console.log("Twitter is ready");
                        }

                        twitterHelper.init(serviceName, twitterReady);
                    });
                },
                Tpost: function (message) {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        function twitterReady() {
                            twitterHelper.post(message, postComplete);
                            console.log("Twitter is ready");
                        }

                        function postComplete(returnObj) {
                            var deferred = $q.defer();
                            if (returnObj.success === true) {
                                console.log("post successful");
                            } else {
                                console.log("post failed");
                            }
                        }

                        twitterHelper.init(serviceName, twitterReady);
                    });

                },
                Tlogout: function () {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        twitterHelper.logout();
                    });
                }
            };
        }
    ])
    .factory('Device', ['$rootScope', 'appReady', '$q',
        function ($rootScope, appReady, $q) {
            return {
                connection: function () {
                    var deferred = $q.defer();
                    $rootScope.safeApply(function () {
                        intel.xdk.device.updateConnection();

                        var response = function () {
                            //debugger;
                            if (intel.xdk.device.connection === 'none' || intel.xdk.device.connection === 'unknown') {
                                deferred.reject(intel.xdk.device.connection);
                            } else {
                                deferred.resolve(intel.xdk.device.connection);
                            }
                        }
                        document.addEventListener("intel.xdk.device.connection.update", response, false);

                    });
                    return deferred.promise;
                }
            };
        }
    ])
    .factory('Contacts', ['$rootScope', 'appReady',
        function ($rootScope, appReady) {
            return {
                getContacts: function () {
                    intel.xdk.contacts.getContacts();
                    var contactsReceived = function () {
                        //var table = document.getElementById("contacts");
                        //table.innerHTML = '';

                        var myContacts = intel.xdk.contacts.getContactList();
                        console.log(myContacts);
                        return myContacts;

                        /*for(var i=0;i<myContacts.length;i++) {
                         //add row to table
                         var contactInfo = intel.xdk.contacts.getContactData(myContacts[i]);
                         var tr = document.createElement("tr");
                         tr.setAttribute('id', 'pnid'+contactInfo.id);
                         tr.setAttribute('onClick', 'document.getElementById("iden").value = '+contactInfo.id+';');
                         tr.setAttribute('style', 'background-color:#B8BFD8');
                         var id = document.createElement("td");
                         id.innerHTML = contactInfo.id;
                         tr.appendChild(id);
                         var msg = document.createElement("td");
                         msg.innerHTML = contactInfo.name;
                         tr.appendChild(msg);
                         table.appendChild(tr);
                         }*/
                    };
                    document.addEventListener('intel.xdk.contacts.get', contactsReceived, false);
                },
                getContactLista: function () {
                    intel.xdk.contacts.getContacts();
                }
            };
        }]);
