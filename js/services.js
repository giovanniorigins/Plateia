function strict() {
    'use strict';
}

var Marketplace = angular.module('plateia', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'pasvaz.bindonce',
    'rn-lazy',
    'google-maps',
    /*'angular-carousel',
    'bensane.ng-swipe',*/
    'jmdobry.angular-cache',
    //'mgcrea.ngStrap',
    'ionic',
    'ionic.contrib.frostedGlass',
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
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 0
            })
            .state('index', {
                //parent: 'nav',
                url: '/',
                templateUrl: 'partials/index.html',
                controller: ['$scope', 'Deals',
                function ($scope, Deals) {
                        $scope.deals = Deals;
            }],
                resolve: {
                    //GetAppData: AppData.resolve,
                    Deals: ['myService',
                    function (myService) {
                            return myService.getDeals();
                }]
                },
                depth: 1
            })
            .state('search', {
                //parent: 'nav',
                url: '/search',
                templateUrl: 'partials/search.html',
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 2
            })
            .state('shops', {
                //parent: 'nav',
                url: '/shops',
                templateUrl: 'partials/shops.html',
                controller: function ($scope, AppData, Shops) {
                    $scope.shops = Shops;
                },
                resolve: {
                    //GetAppData: AppData.resolve/*,
                    Shops: function (myService) {
                        return myService.getShops();
                    }
                },
                depth: 1
            })
            .state('shop', {
                //parent: 'shops',
                url: '/shops/:shopAlias',
                templateUrl: 'partials/shop_detail.html',
                /*controller: function ($scope, Shop) {
    $scope.deals = Shop.deals;
},
resolve: {
    //GetAppData: AppData.resolve,
    Shop: function ($rootScope, myService) {
        return myService.getShopById($rootScope.activeShop.id)
    }
},*/
                depth: 2
            })
            .state('shop_details', {
                //parent: 'shop',
                url: '/shops/:shopAlias/details',
                templateUrl: 'partials/shop_details.html',
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 3
            })
            .state('categories', {
                //parent: 'nav',
                url: '/categories',
                templateUrl: 'partials/categories.html',
                controller: function ($scope, AppData, Categories) {
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
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 1
            })
            .state('activity', {
                //parent: 'nav',
                url: '/activity',
                templateUrl: 'partials/activity.html',
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 1
            })
            .state('invite', {
                //parent: 'nav',
                url: '/invite',
                templateUrl: 'partials/invite.html',
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 1
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'partials/settings.html',
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 1
            })
            .state('help', {
                //parent: 'nav',
                url: '/help',
                templateUrl: 'partials/help.html',
                controller: function ($scope) {},
                resolve: {
                    //GetAppData: AppData.resolve
                },
                depth: 1
            });

        $urlRouterProvider.otherwise("/");

            }]);

angular.module('plateia.services', [])
    .value('version', '2.0')
    .factory('NavItems', function () {
        return [{
            "name": "Home",
            "url": "#/",
            "class": "ion-home"
        }, {
            "name": "Shops",
            "url": "#/shops",
            "class": "ion-bag"
        }, {
            "name": "Categories",
            "url": "#/categories",
            "class": "ion-filing"
        }, {
            "name": "Notifications",
            "url": "#/activity",
            "class": "ion-ios7-bell"
        }, {
            "name": "Settings",
            "url": "#/settings",
            "class": "ion-gear-a"
        }, {
            "name": "Help",
            "url": "#/help",
            "class": "ion-help"
        }];
    })
    .factory('AppData', function () {
        return {
            AppState: {
                currentName: 'Marketplace',
                previousName: '',
                currentApp: 'home',
                previousApp: '',
                Type: intel.xdk.isphone ? 'isPhone' : intel.xdk.istablet ? 'isTablet' : 'isTablet',
                Orientation: intel.xdk.device.orientation == "90" || intel.xdk.device.orientation == "-90" ? 'landscape' : 'portrait',
                Platform: intel.xdk.device.platform,
                Connection: intel.xdk.device.connection,
                AllowGeo: intel.xdk.cache.getCookie('Allow_Geo') == 'true' || false,
                AllowPush: intel.xdk.cache.getCookie('Allow_Push') == 'true' || false,
                //TODO use Type and Orientation
                deviceType: intel.xdk.isphone ? 'isPhone' : 'isTablet',

            },
            BaseURL: 'http://salepoint.gorigins.com/',
            UploadsURL: 'http://salepoint.gorigins.com/uploads/',
            API: {
                Base: 'http://salepoint.gorigins.com/api/',
                Deals: 'http://salepoint.gorigins.com/api/deals/',
                Shops: 'http://salepoint.gorigins.com/api/shops/',
                Categories: 'http://salepoint.gorigins.com/api/categories/',
                Users: 'http://salepoint.gorigins.com/api/users/',
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
    .factory('cookieHandler', function () {
        return {
            save: function (a, b) {
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

            /*** Get Resource lists ***/
            // Get All Deals
            obj.getDeals = function (args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                var Data = $resource(AppData.API.Deals + '*.json' + args, {}, {
                    cache: cache
                });
                var data = Data.get({}, function () {
                    intel.xdk.cache.setCookie('All_Deals', JSON.stringify([data.deals]), '-1');
                    deferred.resolve(data.deals);
                }, function () {
                    // failure
                    if (angular.isDefined(intel.xdk.cache.getCookie('All_Deals'))) {
                        var deals = JSON.parse(intel.xdk.cache.getCookie('All_Deals'));
                        deferred.resolve(deals);
                    } else {
                        intel.xdk.cache.setCookie('All_Deals', JSON.stringify([data.deals]), '-1');
                        deferred.reject('Check internet connection.');
                    }
                });
                LoadingService.loaded();
                return deferred.promise;
            };
            // Get All Shops
            obj.getShops = function (args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                var Data = $resource(AppData.API.Shops + '*.json' + args, {}, {
                    cache: cache
                });
                var data = Data.get({}, function () {
                    intel.xdk.cache.setCookie('All_Shops', JSON.stringify(data.shops), '-1');

                    // Faved Shops
                    if (angular.isDefined(intel.xdk.cache.getCookie('Faved_shops'))) {
                        var favedShops = JSON.parse(intel.xdk.cache.getCookie('Faved_shops'));
                        angular.forEach(data.shops, function (v) {
                            if (favedShops.indexOf(v.id) != -1)
                                v.faved = true;
                        });
                    }
                    //AppData.Arrays.Shops = data.shops;
                    //intel.xdk.cache.setCookie( 'API_Shops', JSON.stringify( data.shops ), '-1' );
                    deferred.resolve(data.shops);
                }, function () {
                    // failure
                    if (angular.isDefined(intel.xdk.cache.getCookie('All_Shops'))) {
                        var shops = JSON.parse(intel.xdk.cache.getCookie('All_Shops'));
                        deferred.resolve(shops);
                    } else {
                        intel.xdk.cache.setCookie('All_Shops', JSON.stringify([data.deals]), '-1');
                        deferred.reject('Check internet connection.');
                    }
                });

                LoadingService.loaded();
                return deferred.promise;
            };
            // Get All Categories
            obj.getCategories = function (args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                var Data = $resource(AppData.API.Categories + '*.json' + args, {}, {
                    cache: cache
                });
                var data = Data.get({}, function () {
                    AppData.Arrays.Categories = data.categories;

                    // SetCookie for Data
                    intel.xdk.cache.setCookie('API_Categories', JSON.stringify(data.categories), '-1');
                    deferred.resolve(data.categories);
                });
                LoadingService.loaded();
                return deferred.promise;
            };

            /*** Get Resource by ID ***/
            // Get Deal by ID
            obj.getDealById = function (id, args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                var Data = $resource(AppData.API.Deals + ':id', {
                    id: '@id'
                }, {
                    cache: cache
                });
                var data = Data.get({
                    id: id
                }, function (data) {
                    deferred.resolve(data.deal);
                });
                LoadingService.loaded();
                return deferred.promise;
            };
            // Get Shop by ID
            obj.getShopById = function (id, args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                if (angular.isUndefined(id)) {
                    deferred.reject('No ID given!');
                    LoadingService.loaded();
                    return deferred.promise;
                }

                var Data = $resource(AppData.API.Shops + id + '.json' + args, {
                    id: '@id'
                }, {
                    cache: cache
                });
                var data = Data.get({
                    id: id
                }, function () {
                    deferred.resolve(data.shop);
                });
                LoadingService.loaded();
                return deferred.promise;
            };
            // Get Category by ID
            obj.getCategoryById = function (id, args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                if (angular.isUndefined(id)) {
                    deferred.reject('No ID given!');
                    LoadingService.loaded();
                    return deferred.promise;
                }

                var Data = $resource(AppData.API.Categories + id + '.json' + args, {
                    id: '@id'
                }, {
                    cache: cache
                });
                var data = Data.get({
                    id: id
                }, function () {
                    deferred.resolve(data.category);
                });
                LoadingService.loaded();
                return deferred.promise;
            };

            /*** Get relation by resource ID ***/
            // Get Deals by Category ID
            obj.getDealsByCategoryId = function (id, args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) ? '' : '?' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                if (angular.isUndefined(id)) {
                    deferred.reject('No ID given!');
                    LoadingService.loaded();
                    return deferred.promise;
                }

                var Data = $resource(AppData.API.Categories + ':id' + '/deals.json' + args, {
                    id: '@id'
                }, {
                    cache: cache
                });
                var data = Data.get({
                    id: id
                }, function () {
                    deferred.resolve(data.deals);
                });
                LoadingService.loaded();
                return deferred.promise;
            };

            /*** Searches ***/
            // Get Deals by terms
            obj.getDealsBySearch = function (args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();
                args = angular.isUndefined(args) || args.length === 0 ? '?terms=%' : '?terms=' + args;
                cache = angular.isUndefined(cache) ? true : cache;

                var Data = $resource(AppData.API.Deals + 'search.json' + args, {}, {
                    cache: cache
                });
                var data = Data.get({}, function () {
                    deferred.resolve(data.deals);
                });
                LoadingService.loaded();
                return deferred.promise;
            };

            /*** User Functions ***/
            // User Register
            obj.userRegistration = function (args, cache) {
                LoadingService.loading(false);
                var deferred = $q.defer();

                $http.post(AppData.API.Users + 'register.json?' + $.param(args), {
                    cache: false
                })
                    .success(function (data, status, headers, config) {

                        switch (data.status) {
                        case 'success':
                            AppData.UserCreds.username = args.username;
                            AppData.UserCreds.password = args.password;

                            deferred.resolve('Account Creation Successful');
                            intel.xdk.cache.setCookie('User_Login', JSON.stringify({
                                'username': args.username,
                                'password': args.password
                            }), '-1');
                            obj.userLogin(AppData.UserCreds);
                            break;
                        case 'error':
                            deferred.reject(data.messages);
                            break;
                        case 'failed':
                            deferred.reject('Account Creation Failed!');
                            break;
                        }
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject('Failed to connect, check connection.');
                        return deferred.promise;
                    });

                LoadingService.loaded();
                return deferred.promise;
            };

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
                    /*if (!background)
                        angular.element('#loading').fadeIn(100);*/
                },
                loaded: function () {
                    $timeout(function () {
                        intel.xdk.notification.hideBusyIndicator();
                        //angular.element('#loading').fadeOut(100);
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
