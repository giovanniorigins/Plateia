var test;
var facebookUserID = "me"; //me = the user currently logged into Facebook

angular.module('plateia.controllers', [])
    .run(['$rootScope', 'AppData', 'Social', 'SearchEngine', '$timeout', 'myService', '$ionicModal', '$ionicActionSheet', '$ionicPopup', '$templateCache', '$state', '$ionicNavBarDelegate', '$ionicLoading',
        function ($rootScope, AppData, Social, SearchEngine, $timeout, myService, $ionicModal, $ionicActionSheet, $ionicPopup, $templateCache, $state, $ionicNavBarDelegate, $ionicLoading) {
            $rootScope.appData = AppData;
            $rootScope.ADarrays = AppData.Arrays;
            $rootScope.ADcounts = AppData.Counts;
            $rootScope.activeCategory = AppData.ActiveCategory;
            $rootScope.activeShop = AppData.ActiveShop;
            $rootScope.activeDeal = AppData.ActiveDeal;
            $rootScope.ADappState = AppData.AppState;
            $rootScope.searchData = AppData.SearchData;
            $rootScope.loginData = AppData.UserCreds;
            $rootScope.userData = AppData.User;
            $rootScope.ADappState.depth = 1;

            // Lets Get Started
            intel.xdk.device.hideSplashScreen();

            // Regular Expressions
            $rootScope.regex = {
                username: /^[a-zA-Z0-9.@_-]+$/,
                fullname: /^[a-z ,.'-]+$/i,
                password: /^[a-zA-Z0-9_-]{6,18}$/,
                email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                email_: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            };

            //FastClick
            FastClick.attach(document.body);

            // Loading
            $rootScope.showLoading = function (backdrop, delay) {
                $rootScope.loading = $ionicLoading.show({
                    content: '<i class="icon ion-loading-b" style="font-size:2em"></i><br>Loading',
                    showBackdrop: backdrop || false,
                    showDelay: delay || 0
                });
            };
            $rootScope.hideLoading = function () {
                if (angular.isDefined($rootScope.loading))
                    $ionicLoading.hide();
            };

            // Cache Templates
            // Main Pages
            $templateCache.get('partials/index.html'); // Home
            $templateCache.get('partials/shops.html'); // Shops
            $templateCache.get('partials/categories.html'); // Categories
            $templateCache.get('partials/search.html'); // Search
            $templateCache.get('partials/activity.html'); // Activity
            //$templateCache.get('partials/shop_detail.html'); // Shop
            $templateCache.get('partials/shop_details.html'); // Shop Details
            $templateCache.get('partials/deal-phone.tpl.html'); // Deal
            $templateCache.get('partials/deal-tablet.tpl.html'); // Deal
            $templateCache.get('partials/deal-modal.tpl.html'); // Deal Modal
            $templateCache.get('partials/category.html'); // Category
            $templateCache.get('partials/invite.html'); // Invite
            $templateCache.get('partials/settings.html'); // Settings
            $templateCache.get('partials/help.html'); // Help

            // Wrap all intel.xdk and cordova functions like $scope.$apply()
            $rootScope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            // Force rotation css changes
            $rootScope.safeApply(function () {
                document.addEventListener('intel.xdk.device.orientation.change', function (a) {
                    $rootScope.ADappState.Orientation = a.orientation == "90" || a.orientation == "-90" ? 'landscape' : 'portrait';
                    if ($rootScope.ADappState.Orientation == 'landscape') {
                        angular.element('body').removeClass('portrait');
                        angular.element('body').addClass('landscape');
                    }
                })
            });

            $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
                $rootScope.ADappState.depth = current.depth;
                if (current.depth == 1) {
                    $rootScope.activeDeal = $rootScope.activeShop = undefined;
                }
                ////console.log($state.current);
            });

            $rootScope.getPreviousTitle = function () {
                return $ionicNavBarDelegate.getPreviousTitle();
            };

            /* Object Selection Functions
             ******************************/
            // Select Category
            $rootScope.selectCategory = function (category) {
                $rootScope.showLoading();
                $rootScope.ADappState.currentName = category.title;
                $rootScope.activeCategory = category;
                $state.go('category', {
                    'catAlias': category.title_alias
                });
            };

            // Select Shop
            $rootScope.selectShop = function (shop, locOnly) {
                locOnly = angular.isDefined(locOnly) ? locOnly : false;

                $rootScope.activeShop = AppData.ActiveShop = shop;
                if (locOnly) {
                    if ($rootScope.ADappState.AllowGeo) {
                        if (shop.shop_locations_data !== '') {
                            var mapAside = $ionicModal.fromTemplateUrl('partials/map-aside.tpl.html', {
                                scope: $rootScope,
                                animation: 'slide-in-up'
                            });

                            mapAside.then(function (modal) {
                                $rootScope.modal = modal;
                                $rootScope.modal.show();
                            });
                        } else {
                            $ionicPopup.alert({
                                title: 'Sorry!',
                                content: 'There are no directions available for this store at this time!'
                            });
                        }
                    } else {
                        $ionicPopup.alert({
                            title: 'Sorry',
                            content: 'You must enable Geolocation to find locations!'
                        });
                    }
                } else {
                    $rootScope.showLoading();
                    $rootScope.ADappState.currentName = shop.title;
                    $state.go('shop', {
                        'shopAlias': shop.title_alias
                    });
                }
            };

            // Select Deal
            $rootScope.selectDeal = function (deal, isRelated, toLoc) {
                console.log(deal);
                isRelated = angular.isDefined(isRelated) ? isRelated : false;
                toLoc = angular.isDefined(toLoc) ? toLoc : false;

                if (angular.element('#DealModal').length === 0 || isRelated) {
                    $rootScope.activeDeal = deal;
                    var dealModal = $ionicModal.fromTemplateUrl('partials/deal-modal.tpl.html', {
                        scope: $rootScope,
                        animation: 'am-slide-right'
                    });

                    dealModal.then(function (modal) {
                        var delay = isRelated === true ? 320 : 0;
                        $timeout(function () {
                            $rootScope.modal = modal;
                            $rootScope.modal.show().then(function () {
                                //angular.element('.modal-backdrop').click(function () {
                                //alert('yea');
                                //});
                            });
                            if (toLoc) {
                                if ($rootScope.ADappState.AllowGeo) {
                                    $rootScope.$broadcast('Show Location');
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Sorry',
                                        content: 'You must enable Geolocation to find locations!'
                                    });
                                }
                            }
                        }, delay);
                    });
                }
            };

            /* Object Misc Functions
             ******************************/
            $rootScope.favShop = function (shop) {
                shop.faved = !shop.faved;
                if (angular.isDefined(intel.xdk.cache.getCookie('Faved_shops'))) {
                    var favedShops = [];
                    favedShops = JSON.parse(intel.xdk.cache.getCookie('Faved_shops'));
                    favedShops.indexOf(shop.id) != -1 ? favedShops.splice(favedShops.indexOf(shop.id), 1) : favedShops.push(shop.id);
                    intel.xdk.cache.setCookie('Faved_shops', JSON.stringify(favedShops), '-1');
                } else {
                    intel.xdk.cache.setCookie('Faved_shops', JSON.stringify([shop.id]), '-1');
                }
                return shop.faved;
            };

            /* Object Share Modal Functions
             ********************************/
            $rootScope.shareFacebook = function (deal) {
                var strippedDescription = deal.description.replace(/(<([^>]+)>)/ig,"");
                var objParameters = {
                    "picture": deal.coupon_image,
                    "name": deal.title,
                    "caption": "http://marketplace.bs",
                    "description": strippedDescription,
                    "link": deal.url
                };
                console.log(objParameters);

                Social.FBshowNewsFeedDialog(objParameters);
            };

            $rootScope.shareTwitter = function (deal) {
                Social.Tpost('Check this Out! ' + deal.url);
            };

            $rootScope.shareLink = function (item) {
                $ionicPopup.alert({
                    title: 'Copy text.',
                    content: item.url
                });
            };

            $rootScope.shareEmail = function (deal) {
                intel.xdk.device.sendEmail(deal.title + '\n' + deal.description, "", deal.title, true, "", "");
            };

            $rootScope.shareText = function (deal) {
                intel.xdk.device.sendSMS('Check dis\' Out! - ' + deal.url, '');
            };


            /* Banners */
            $rootScope.homeBanners = [
                {
                    title: 'Slide 1',
                    src: 'images/slides/slide_1.jpg'
                },
                {
                    title: 'Slide 2',
                    src: 'images/slides/slide_2.jpg'
                }
            ];

            /* View Functions
             ********************************/
            $rootScope.search = function (e) {
                if (e.which == 13) {
                    //document.activeElement.blur();
                    $rootScope.ADappState.currentName = 'Search: ' + $rootScope.searchData.search;
                    $rootScope.searchData.results = SearchEngine.deals($rootScope.searchData.search);
                    if ($state.current.name != 'search')
                        $state.go('search');
                }
            };

            $rootScope.searchTag = function (tag) {
                $rootScope.searchData.search = tag;
                $rootScope.ADappState.currentName = 'Search:' + $rootScope.searchData.search;
                $rootScope.searchData.results = SearchEngine.deals($rootScope.searchData.search);
                if ($state.current.name != 'search')
                    $state.go('search');
            };

            $rootScope.refreshHandler = function (run) {
                $timeout(function () {
                    $rootScope.ADappState.refreshing = run;
                }, 1800);
            };

            $rootScope.doRefresh = function () {
                $rootScope.safeApply(function () {
                    angular.element('html, body').animate({
                        scrollTop: 0
                    }, 400);
                });
                $rootScope.$broadcast('doRefresh');
            };

            $rootScope.toExpire = function (date) {
                return moment(date).fromNow();
            };

            $rootScope.goTo = function (path, childId) {
                switch (path) {
                case 'categories':
                    myService.getCategoryById(childId)
                        .then(function (data) {
                            $rootScope.activeCategory = data;
                            return $state.go('category', {
                                'catAlias': data.title_alias
                            });
                        });
                    break;
                case 'shops':
                    myService.getShopById(childId)
                        .then(function (data) {
                            $rootScope.activeShop = data;
                            return $state.go('shop', {
                                'shopAlias': data.title_alias
                            });
                        });
                    break;
                default:
                    ////console.log(path, ': ', childId);
                    return false;

                }
            };


            /* List Buttons */
            $rootScope.dealOptions = [{
                text: '',
                type: 'button button-icon icon ion-share',
                onTap: function (item) {
                    $rootScope.openShare(item);
                }
            }, {
                text: '',
                type: 'button button-icon icon ion-location',
                onTap: function (item) {
                    $rootScope.selectDeal(item, false, true);
                }
            }];

            $rootScope.shopOptions = [{
                text: '',
                type: 'button button-icon icon ion-star',
                onTap: function (item) {
                    $rootScope.favShop(item);
                }
            }, {
                text: '',
                type: 'button button-icon icon ion-location',
                onTap: function (item) {
                    $rootScope.selectShop(item, true);
                }
            }];
            /*, {
    text: '',
    type: 'button button-icon icon icon ion-share',
    onTap: function (item) {
        $rootScope.openShare(item);
    }
            }*/



            $rootScope.openShare = function (item) {
                // Show the action sheet
                $ionicActionSheet.show({
                    buttons: [{
                        text: 'Facebook'
                        }, {
                        text: 'Text Message'
                        }, {
                        text: 'Email'
                        }, {
                        text: 'Copy Link'
                        }],
                    destructiveText: '',
                    titleText: 'Share',
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        switch (index) {
                        case 0:
                            $rootScope.shareFacebook(item);
                            break;
                        case 1:
                            $rootScope.shareText(item);
                            break;
                        case 2:
                            $rootScope.shareEmail(item);
                            break;
                        case 3:
                            $rootScope.shareLink(item);
                            break;

                        }
                        return true;
                    }
                });
            };

            /* Modal Functions */
            $rootScope.closeModal = function () {
                $rootScope.modal.hide().then(function () {
                    angular.element('.modal').addClass('opacity-hide');
                    $rootScope.modal.remove();
                });
            };

            //Cleanup the modal when we're done with it!
            $rootScope.$on('$destroy', function () {
                $rootScope.modal.remove();
            });

            /* Login Functions
             ********************************/
            if (angular.isDefined(intel.xdk.cache.getCookie('User_Login'))) {
                var a = JSON.parse(intel.xdk.cache.getCookie('User_Login'));
                angular.extend($rootScope.loginData, a);
                myService.processLogin(true);
            }

            $rootScope.$on('$stateNotFound',
                function (event, unfoundState, fromState, fromParams) {
                    ////console.log(unfoundState.to); // "lazy.state"
                    //console.log(unfoundState.toParams); // {a:1, b:2}
                    //console.log(unfoundState.options); // {inherit:false} + default options
                });

            $rootScope.lastUpdated = function (date) {
                return 'Last updated ' + moment(date).fromNow();
            }
        }
    ])
    .controller('BodyCtrl', ['$scope', 'AppData', 'myService', '$ionicSideMenuDelegate', '$ionicModal', '$timeout', '$ionicFrostedDelegate', '$state',
        function ($scope, AppData, myService, $ionicSideMenuDelegate, $ionicModal, $timeout, $ionicFrostedDelegate, $state) {
            $scope.ADappState = AppData.AppState;
            $scope.list = [];
            $scope.openLeft = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };
            $ionicSideMenuDelegate.canDragContent(true);
            $ionicFrostedDelegate.update();

            $scope.closeWelcome = function () {
                intel.xdk.cache.setCookie('Welcomed', 'true', '-1');
                $state.go('index');
            };

            $scope.openWelcome = function () {
                intel.xdk.cache.removeCookie('Welcomed');
                //$scope.isWelcomed = false;
                $state.go('intro');
            };

            // Deal Filters
            $scope.dealFilters = {
                type: ''
            };

            /* Open Modals */
            $scope.openModal = function (name) {
                switch (name) {
                case 'privacy':
                    $ionicModal.fromTemplateUrl('partials/policies/privacy.tpl.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.policy = modal;
                        $scope.policy.show();
                    });
                    break;
                case 'service':
                    $ionicModal.fromTemplateUrl('partials/policies/TOS.tpl.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.policy = modal;
                        $scope.policy.show();
                    });
                    break;
                case 'login':
                    var loginAside = $ionicModal.fromTemplateUrl('partials/login-aside.tpl.html', {
                        scope: $scope,
                        animation: 'am-fade-and-scale',
                        focusFirstInput: true
                    });
                    loginAside.then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                    break;
                case 'register':
                    var registerAside = $ionicModal.fromTemplateUrl('partials/register-aside.tpl.html', {
                        scope: $scope,
                        animation: 'am-fade-and-scale',
                        focusFirstInput: true
                    });

                    registerAside.then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                    break;
                case 'filter':
                    var filterAside = $ionicModal.fromTemplateUrl('partials/filter-aside.tpl.html', {
                        scope: $scope,
                        animation: 'am-fade-and-scale'
                    });

                    filterAside.then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                    break;
                }
            };

            $scope.openFilter = function () {
                var filterAside = $ionicModal.fromTemplateUrl('partials/filter-aside.tpl.html', {
                    scope: $scope,
                    animation: 'am-fade-and-scale'
                });

                filterAside.then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };

            $scope.openLogin = function () {
                var loginAside = $ionicModal.fromTemplateUrl('partials/login-aside.tpl.html', {
                    scope: $scope,
                    animation: 'am-fade-and-scale',
                    focusFirstInput: true
                });
                loginAside.then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };

            $scope.openRegister = function () {
                var registerAside = $ionicModal.fromTemplateUrl('partials/register-aside.tpl.html', {
                    scope: $scope,
                    animation: 'am-fade-and-scale',
                    focusFirstInput: true
                });

                registerAside.then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };

            $scope.openProfile = function () {
                var profileAside = $ionicModal.fromTemplateUrl('partials/profile-aside.tpl.html', {
                    scope: $scope,
                    animation: 'am-slide-right'
                });

                profileAside.then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };

            $scope.siteLogin = function () {

                var promise = myService.checkStatus($scope.loginData);
                promise.then(function (success) {
                    myService.processLogin(false)
                        .then(function (success) {
                            //console.log('Successful Login');
                        });
                }, function (failure) {
                    if (angular.isDefined(intel.xdk.cache.getCookie('User_Login'))) {
                        var userCreds = JSON.parse(intel.xdk.cache.getCookie('User_Login'));
                        $scope.loginData.username = userCreds.username;
                        $scope.loginData.password = userCreds.password;
                        myService.processLogin(false)
                            .then(function (success) {
                                //console.log(success);
                            }, function (failure) {
                                //console.log(failure);
                                $scope.openLogin();

                            });
                    } else if ($scope.loginData.username === '' || $scope.loginData.password === '') {
                        $scope.openLogin();
                    }
                });

            };

            $scope.autoLogin = function () {
                //console.log((intel.xdk.cache.getCookie('User_Login')));
                var promise = myService.processLogin();
                promise.then(function (success) {
                    alert('Success: ' + success);
                }, function (failure) {
                    alert('Failed: ' + failure);
                    deferred.reject(failure);
                });
            };

            $scope.startloginKeydown = function (e) {
                if (e.which == 13 || e.keyCode == 13) {
                    $scope.hide();
                    $scope.startLogin();
                    return true;
                }
            };

            $scope.startLogin = function () {
                //console.log('User: ', $scope.loginData);
                myService.processLogin(false)
                    .then(function (data) {
                        //console.log('success', data);
                        $scope.closeModal();
                    });
            };


            $scope.accountLogout = function () {
                var promise = myService.userLogout();
                promise.then(function (success) {
                    //console.log(success);
                }, function (error) {
                    //console.log(error);
                });
            };

            //Attempt Login
            /*if (angular.isDefined(intel.xdk.cache.getCookie('User_Login')))
    $scope.autoLogin(true);*/

            /* Event Watchers
             ********************************/
            $scope.safeApply(function () {
                document.addEventListener("intel.xdk.device.connection.update", function (e) {
                    //console.log(e);
                }, false);
            });

            /* Modal Functions */
            $scope.closeModal = function () {
                if (angular.element('.policy').length) {
                    $scope.policy.hide().then(function () {
                        angular.element('.policy').addClass('opacity-hide');
                        $scope.policy.remove();
                    });
                } else {
                    $scope.modal.hide().then(function () {
                        angular.element('.modal').addClass('opacity-hide');
                        $scope.modal.remove();
                    });
                }
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            /*$scope Events*/
            /*$scope.$on('Login Modal Data', function (event, data) {
                debugger;
            });*/

        }
    ])
    .controller('HomeCtrl', ['$scope', '$q', 'myService', '$state', '$timeout', 'Device',
        function ($scope, $q, myService, $state, $timeout, Device) {
            $scope.ADappState.currentName = 'Marketplace';
            $scope.ADappState.currentApp = 'home';

            $scope.homeBanners = [
                {
                    title: 'Slide 1',
                    src: 'images/slides/slide_1.jpg'
                },
                {
                    title: 'Slide 2',
                    src: 'images/slides/slide_2.jpg'
                }
            ];

            $scope.limit = 50;
            $scope.start = 50;
            $scope.busy = false;
            $scope.prevCall = angular.isDefined($scope.deals) ? $scope.deals.length : 0;

            $scope.loadMore = function (reload) {
                reload = angular.isDefined(reload) ? reload : false;
                if ($scope.busy === false && $scope.prevCall !== null && $scope.prevCall == $scope.limit) {
                    var deferred = $q.defer();
                    $scope.busy = true;
                    var cache = $scope.start === 0 ? false : true;
                    myService.getDeals('limit=' + $scope.limit + '&start=' + $scope.start, cache)
                        .then(function (data) {
                            if (reload && angular.isArray(data) && data.length > 0) {
                                $scope.deals.length = 0;
                            }
                            angular.forEach(data, function (index) {
                                $timeout(function () {
                                    $scope.deals.push(index);
                                }, 0);
                            });
                            $scope.prevCall = data;
                            $scope.lastRefreshed = moment().toISOString();
                            //console.log($scope.limit, ': ', data);
                        }).then(function (data) {
                            $scope.start += $scope.limit;
                            $scope.busy = false;
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            deferred.resolve(data);
                        });
                    return deferred.promise;
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
            };

            $scope.onReload = function () {
                $scope.prevCall = 50;
                $scope.start = 0;

                var promise = $scope.loadMore(true);
                return promise;
            };

            $scope.$on('doRefresh', function (e) {
                $scope.ADappState.refreshing = true;
                $scope.onReload();
            });

            var defer = $q.defer();
            defer.promise.then(function () {
                angular.element('#loading').hide();
            });

            $scope.hideLoading();

            $scope.toggleSearchbar = function (event) {
                //debugger;
                ////console.log(test = event);
            };

            // Show and Hide search bar on scroll
            /*var sb1 = ionic.onGesture('dragup', function (event) {
                angular.element('.bar-subheader').addClass('opacity-hide');
            }, angular.element('.menu-content ion-content')[0]);

            var sb2 = ionic.onGesture('dragdown', function (event) {
                angular.element('.bar-subheader').removeClass('opacity-hide');
            }, angular.element('.menu-content ion-content')[0]);*/

            $scope.$on('$destroy', function () {

            });

            // Welcome Functions
            var welcomed;
            $timeout(function () {
                if (angular.isUndefined(welcomed = intel.xdk.cache.getCookie('Welcomed')) || welcomed == 'false') {
                    $state.go('intro');
                }
            }, 0);

        }
    ])
    .controller('DealCtrl', ['$scope', '$timeout', 'myService', 'Geolocation', '$ionicLoading',
        function ($scope, $timeout, myService, Geolocation, $ionicLoading) {
            $scope.state = 'main';

            $scope.toggleState = function (state) {
                state = angular.isDefined(state) ? state : false;
                switch (state || $scope.state) {
                case 'main':
                    $scope.state = 'map';
                    $timeout(function () {
                        $scope.launchMap();
                    }, 300);
                    break;
                case 'map':
                    $scope.state = 'main';
                    $scope.gMap = $scope.map = null;
                    break;
                default:
                    if ($scope.state == 'map') {
                        //google.maps.event.clearInstanceListeners($scope.gMap);
                        $scope.gMap = null;
                        //angular.element("#map-canvas").hide();
                    }
                    $scope.state = 'main';
                    $scope.loadSlider();
                }
            };

            $scope.$on('Show Location', function () {
                $scope.toggleState('main');
            });
            $scope.closeModal = function () {
                $scope.modal.hide();
                $timeout(function () {
                    angular.element('.modal').addClass('opacity-hide');
                    $timeout(function () {
                        $scope.modal.remove();
                    }, 10);
                }, 300);
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            $scope.dealImages = [{
                title: '',
                path: $scope.activeDeal.coupon_image
            }];
            if ($scope.activeDeal.coupon_images != 0)
                $scope.dealImages = $scope.dealImages.concat($scope.activeDeal.coupon_images);

            $scope.loadSlider = function () {
                $timeout(function () {
                    $scope.swipeCurrent = 1;
                    window.mySwipe = new Swipe(document.getElementById('slider'), {
                        speed: 400,
                        auto: 3000,
                        continuous: true,
                        disableScroll: false,
                        stopPropagation: false,
                        callback: function (index, elem) {},
                        transitionEnd: function (index, elem) {
                            $scope.safeApply(function () {
                                $scope.swipeCurrent = window.mySwipe.getPos() + 1;
                            });
                        }
                    });

                    $scope.swipeMax = window.mySwipe.getNumSlides();
                }, 200);
            };
            $scope.loadSlider();

            myService.getDealsByCategoryId($scope.activeDeal.category_id)
                .then(function (data) {
                    if (angular.isArray(data)) {
                        angular.forEach(data, function (val, index) {
                            if (val.id === $scope.activeDeal.id)
                                data.splice(index, 1);
                        });
                    }
                    $scope.relatedDeals = data;
                });

            myService.getShopById($scope.activeDeal.shop_id)
                .then(function (data) {
                    $scope.activeDeal.shop = data;
                    $scope.hasDirections = data.shop_locations_data !== '' ? true : false;
                });

            $scope.thumbs = function (deal, direction) {
                myService.thumbs(deal.id, deal.url, direction)
                    .then(function (success) {
                        $scope.activeDeal.thumbs_num = success;
                    }, function (failure) {
                        //console.log(failure);
                    });

            };

            $scope.share = function (activeDeal) {
                $scope.openShare(activeDeal);
            };

            $scope.launchMap = function () {

                $scope.loading = $ionicLoading.show({
                    content: 'Loading directions',
                    showBackdrop: false
                });

                $scope.close = function () {
                    google.maps.event.clearInstanceListeners($scope.gMap);
                    $scope.gMap = null;
                    angular.element("#map-canvas").hide();
                    //$scope.closeModal();
                };

                if ($scope.activeDeal.shop.shop_locations_data.indexOf('\r\n') != -1) {
                    $scope.destinations = [];
                    var list = $scope.activeDeal.shop.shop_locations_data.split('\r\n');
                    angular.forEach(list, function (value, index) {
                        var a = value.split(',');
                        $scope.destinations.push({
                            title: $scope.activeDeal.shop.shop_locations[index],
                            showWindow: false,
                            LatLng: new google.maps.LatLng(a[0], a[1]),
                            latitude: a[0],
                            longitude:a[1]
                        });
                    });


                } else {
                    var a = $scope.activeDeal.shop.shop_locations_data.split(',');
                    $scope.destinations = {
                        title: $scope.activeDeal.shop.shop_locations,
                        showWindow: false,
                        LatLng: new google.maps.LatLng(a[0], a[1]),
                        coords: {
                            latitude: a[0],
                            longitude:a[1]
                        }
                    };
                }
                console.log('Markers: ', $scope.destinations);

                Geolocation.getCurrentPosition()
                    .then(function (success) {
                            //console.log(success);
                            //angular.element('#map-canvas').innerHeight(300);
                            // Google Maps Code
                            var loadedOnce = false;
                            var me = new google.maps.LatLng(success.coords.latitude, success.coords.longitude);

                            var boundsBS = new google.maps.LatLngBounds(
                                new google.maps.LatLng(24.960395, -77.590754),
                                new google.maps.LatLng(25.102868, -77.239879)
                            );

                            $scope.map = {
                                center: {
                                    latitude: success.coords.latitude,
                                    longitude: success.coords.longitude
                                },
                                zoom: 11,
                                options: {
                                    panControl: false,
                                    maxZoom: 20,
                                    minZoom: 3,
                                    center: me,
                                    zoom: 11,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                                    provideRouteAlternatives: true,
                                    streetViewControl: false,
                                    zoomControl: true,
                                    zoomControlOptions: {
                                        style: google.maps.ZoomControlStyle.DEFAULT,
                                        position: google.maps.ControlPosition.LEFT_TOP
                                    }
                                },
                                dragging: false,
                                bounds: {},
                                events: {
                                    tilesloaded: function (map, eventName, originalEventArgs) {
                                        console.log('Tiles Loaded');

                                        if (loadedOnce === false) {
                                            console.log(loadedOnce);
                                            $scope.gMap = $scope.map.control.getGMap();
                                            google.maps.event.trigger($scope.gMap, 'resize');
                                            console.log($scope.gMap);
                                            loadedOnce = true;
                                        } else {
                                            console.log(loadedOnce);
                                        }

                                    }
                                }
                            };
                            var renderOptions = {
                                panel: angular.element('#MapAside .directions')[0],
                                suppressBicyclingLayer: true,
                                polylineOptions: {
                                    clickable: true
                                }
                            };


                            var directionsService = new google.maps.DirectionsService(),
                                directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);

                            //$scope.gMap = new google.maps.Map(document.getElementById("map-canvas"), $scope.map.options);
                        $timeout(function(){

                        },500);
                            //directionsDisplay.setMap($scope.map);
                            //directionsDisplay.setOptions(renderOptions);

                            // Set Markers AND/OR Routes
                            if (angular.isArray($scope.destinations)) {
                                var markers = [];
                                angular.forEach($scope.destinations, function (val, index) {
                                    $timeout(function () {
                                        markers.push(new google.maps.Marker({
                                            position: val.LatLng,
                                            title: val.title,
                                            map: $scope.gMap,
                                            draggable: false,
                                            animation: google.maps.Animation.DROP
                                        }));
                                        // Add a listener for the click event for each marker
                                        google.maps.event.addListener(markers[index], 'click', function () {
                                            var request = {
                                                origin: me,
                                                destination: val.LatLng,
                                                travelMode: google.maps.TravelMode.DRIVING
                                            };

                                            directionsService.route(request, function (result, status) {
                                                if (status == google.maps.DirectionsStatus.OK) {
                                                    directionsDisplay.setDirections(result);
                                                } else {
                                                    //console.log('Status: ', status);
                                                    //console.log('Result: ', result);
                                                }
                                            });

                                        });
                                    }, 200);
                                });
                            } else {
                                var request = {
                                    origin: me,
                                    destination: $scope.destinations.LatLng,
                                    travelMode: google.maps.TravelMode.DRIVING
                                };

                                directionsService.route(request, function (result, status) {
                                    if (status == google.maps.DirectionsStatus.OK) {
                                        directionsDisplay.setDirections(result);
                                    } else {
                                        //console.log('Status: ', status);
                                        //console.log('Result: ', result);
                                    }
                                });
                            }


                        $ionicLoading.hide();
                        },
                        function (failure) {
                            //console.log(failure);
                        });
            };

            $timeout(function () {
                test = $scope.gMap;
                //var center = $scope.gMap.getCenter();
                google.maps.event.trigger($scope.gMap, "resize");
                //$scope.gMap.setCenter(center);
            }, 300);
        }
    ])
    .controller('ShopsCtrl', ['$scope', 'myService', '$q', '$ionicModal',
    function ($scope, myService, $q, $ionicModal) {
            $scope.ADappState.currentName = 'Stores';
            $scope.ADappState.currentApp = 'stores';
            $scope.activeCategory = undefined;

            $scope.limit = 50;
            $scope.start = 50;
            $scope.busy = false;
            $scope.prevCall = angular.isDefined($scope.shops) ? $scope.shops.length.length : 0;

            $scope.loadMore = function () {
                if ($scope.busy === false && $scope.prevCall !== null && $scope.prevCall == $scope.limit) {
                    var deferred = $q.defer();
                    $scope.busy = true;
                    var cache = $scope.start === 0 ? false : true;
                    myService.getShops('limit=' + $scope.limit + '&start=' + $scope.start, cache)
                        .then(function (data) {
                            angular.forEach(data, function (index) {
                                $scope.shops.push(index);
                            });
                            $scope.lastRefreshed = moment().toISOString();
                            $scope.prevCall = data;
                        }).then(function (data) {
                            $scope.start += $scope.limit;
                            $scope.busy = false;
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            deferred.resolve(data);
                        });
                    return deferred.promise;
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
            };

            $scope.onReload = function () {
                $scope.prevCall = 50;
                $scope.start = 0;
                $scope.shops.length = 0;
                var promise = $scope.loadMore();
                return promise;
            };

            $scope.$on('doRefresh', function (e) {
                $scope.ADappState.refreshing = true;
                $scope.onReload();
            });

            $scope.shopShare = function (shop) {
                $scope.openShare(shop);
            };

            var defer = $q.defer();
            defer.promise.then(function () {
                $scope.hideLoading();
            });

            defer.resolve();

        }
    ])
    .controller('MapCtrl', ['$scope', 'Geolocation', '$timeout', 'AppData',
        function ($scope, Geolocation, $timeout, AppData) {
            // For Shops ONLY!
            $scope.activeShop = AppData.ActiveShop;

            $scope.closeModal = function () {
                google.maps.event.clearInstanceListeners($scope.gMap);
                //angular.element("#map-canvas").hide();
                $scope.modal.hide();
                $timeout(function () {
                    angular.element('.modal').addClass('opacity-hide');
                    $timeout(function () {
                        $scope.modal.remove();
                    }, 10);
                }, 300);
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            if ($scope.activeShop.shop_locations_data.indexOf('\r\n') != -1) {
                $scope.destinations = [];
                var list = $scope.activeShop.shop_locations_data.split('\r\n');
                angular.forEach(list, function (value, index) {
                    var a = value.split(',');
                    $scope.destinations.push({
                        title: $scope.activeShop.shop_locations[index],
                        LatLng: new google.maps.LatLng(a[0], a[1])
                    });
                });

            } else {
                $scope.destinations = {
                    title: $scope.activeShop.shop_locations,
                    LatLng: $scope.activeShop.shop_locations_data
                };
            }

            Geolocation.getCurrentPosition()
                .then(function (success) {
                        //console.log(success);
                        angular.element('#map-canvas').innerHeight(angular.element('#MapAside') * 0.5);
                        // Google Maps Code
                        var me = new google.maps.LatLng(success.coords.latitude, success.coords.longitude);

                        var boundsBS = new google.maps.LatLngBounds(new google.maps.LatLng(24.960395, -77.590754), new google.maps.LatLng(25.102868, -77.239879));

                        var mapOptions = {
                            center: me,
                            zoom: 11,
                            provideRouteAlternatives: true,
                            streetViewControl: false,
                            zoomControl: true,
                            zoomControlOptions: {
                                style: google.maps.ZoomControlStyle.DEFAULT,
                                position: google.maps.ControlPosition.LEFT_TOP
                            }
                        };
                        var renderOptions = {
                            panel: angular.element('#MapAside .directions')[0],
                            suppressBicyclingLayer: true,
                            polylineOptions: {
                                clickable: true
                            }
                        };

                        var directionsService = new google.maps.DirectionsService(),
                            directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);

                        $scope.gMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                        directionsDisplay.setMap($scope.gMap);

                        // Set Markers AND/OR Routes
                        if (angular.isArray($scope.destinations)) {
                            var markers = [];
                            angular.forEach($scope.destinations, function (val, index) {
                                $timeout(function () {
                                    markers.push(new google.maps.Marker({
                                        position: val.LatLng,
                                        title: val.title,
                                        map: $scope.gMap,
                                        draggable: false,
                                        animation: google.maps.Animation.DROP
                                    }));
                                    // Add a listener for the click event for each marker
                                    google.maps.event.addListener(markers[index], 'click', function () {
                                        var request = {
                                            origin: me,
                                            destination: val.LatLng,
                                            travelMode: google.maps.TravelMode.DRIVING
                                        };

                                        directionsService.route(request, function (result, status) {
                                            if (status == google.maps.DirectionsStatus.OK) {
                                                directionsDisplay.setDirections(result);
                                            } else {
                                                //console.log('Status: ', status);
                                                //console.log('Result: ', result);
                                            }
                                        });

                                    });
                                }, 200);
                            });
                        } else {
                            var request = {
                                origin: me,
                                destination: $scope.destinations.LatLng,
                                travelMode: google.maps.TravelMode.DRIVING
                            };

                            directionsService.route(request, function (result, status) {
                                if (status == google.maps.DirectionsStatus.OK) {
                                    directionsDisplay.setDirections(result);
                                } else {
                                    //console.log('Status: ', status);
                                    //console.log('Result: ', result);
                                }
                            });
                        }

                        var center = $scope.gMap.getCenter();
                        google.maps.event.trigger($scope.gMap, "resize");
                        $scope.gMap.setCenter(center);

                    },
                    function (failure) {
                        //console.log(failure);
                    });

        }
    ])
    .controller('ShopCtrl', ['$scope', 'myService', '$q',
        function ($scope, myService, $q) {
            $scope.ADappState.currentApp = 'shop';
            $scope.ADappState.currentName = $scope.activeShop.title;

            $scope.limit = 50;
            $scope.start = 0;
            $scope.busy = false;
            $scope.prevCall = angular.isDefined($scope.deals) ? $scope.deals.length.length : 0;

            $scope.loadMore = function () {
                if ($scope.busy === false && $scope.prevCall !== null && $scope.prevCall == $scope.limit) {
                    var deferred = $q.defer();

                    $scope.busy = true;
                    var cache = $scope.start === 0 ? false : true;
                    myService.getShopById($scope.activeShop.id, 'limit=' + $scope.limit + '&start=' + $scope.start, cache)
                        .then(function (data) {
                            angular.forEach(data.deals, function (index) {
                                $scope.deals.push(index);
                            });
                            $scope.lastRefreshed = moment().toISOString();
                            deferred.resolve(data.deals);
                        }).then(function (data) {
                            $scope.start += $scope.limit;
                            $scope.busy = false;
                            $scope.refreshHandler(false);
                        });

                    return deferred.promise;
                } else {
                    $scope.refreshHandler(false);
                    return false;
                }

                $scope.hideLoading();
            };

            $scope.onReload = function () {
                $scope.prevCall = 50;
                $scope.start = 0;
                $scope.deals.length = 0;
                var promise = $scope.loadMore();
                return promise;
            };

            $scope.$on('doRefresh', function (e) {
                $scope.ADappState.refreshing = true;
                $scope.onReload();
            });

            // Load Items
            myService.getShopById($scope.activeShop.id)
                .then(function (success) {
                    $scope.deals = success.deals;
                }, function (error) {});

            $scope.hideLoading();

        }
    ])
    .controller('ShopDetailsCtrl', ['$scope',
        function ($scope) {
            $scope.ADappState.currentApp = 'shop_details';
            $scope.ADappState.currentName = $scope.activeShop.title;

        }
    ])
    .controller('CategoriesCtrl', ['$scope', 'myService',
        function ($scope, myService) {
            $scope.ADappState.currentName = 'Categories';
            $scope.ADappState.currentApp = 'categories';

            $scope.onReload = function () {
                $scope.lastRefreshed = moment().toISOString();
                var promise = myService.getCategories();
                return promise;
            };

            $scope.hideLoading();

        }
    ])
    .controller('CategoryCtrl', ['$scope', '$q', 'myService',
        function ($scope, $q, myService) {
            //console.log('here');
            $scope.ADappState.currentApp = 'categories';
            $scope.ADappState.currentName = $scope.activeCategory.title;

            $scope.limit = 50;
            $scope.start = 0;
            $scope.busy = false;

            $scope.loadMore = function () {
                var deferred = $q.defer();

                $scope.busy = true;
                var cache = $scope.start === 0 ? false : true;
                myService.getDealsByCategoryId($scope.activeCategory.id, 'limit=' + $scope.limit + '&start=' + $scope.start, cache)
                    .then(function (data) {
                        angular.forEach(data.coupons, function (index) {
                            $scope.deals.push(index);
                        });
                        $scope.lastRefreshed = moment().toISOString();
                        deferred.resolve(data);
                    }).then(function (data) {
                        $scope.start += $scope.limit;
                        $scope.busy = false;
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });

                return deferred.promise;
            };

            $scope.onReload = function () {
                $scope.limit = 10;
                $scope.start = 0;

                $scope.deals.length = 0;
                var promise = $scope.loadMore();
                return promise;
            };

            $scope.$on('doRefresh', function (e) {
                $scope.ADappState.refreshing = true;
                $scope.onReload();
            });

            $scope.hideLoading();

        }
    ])

// Misc Ctrls
.controller('ActivityCtrl', ['$scope', 'Geolocation', 'Social', 'PN', '$timeout',
        function ($scope, Geolocation, Social, PN, $timeout) {
        $scope.ADappState.currentName = 'Activity';
        $scope.ADappState.currentApp = 'activity';
        $scope.position = {};
        $scope.fbData = {};
        $scope.notifs = [];
        $scope.getNotifs = function () {
            $scope.notifs = PN.getNotificationList();
        };
        $scope.safeApply(function () {
            document.addEventListener("appMobi.notification.push.receive", function () {
                $scope.getNotifs();
                //console.log(PN.getNotificationList());
            }, false);
        });

        $timeout(function () {
            $scope.getNotifs();
        }, 0);

        $scope.hideLoading();

        }
    ])
    .controller('SearchCtrl', ['$scope', '$timeout', 'myService',
        function ($scope, $timeout, myService) {
            $scope.searching = function () {

            };

            $scope.$evalAsync(
                $scope.searching()
            );

            $scope.$on('$destroy', function () {
                $scope.searchData.search = '';
            });

        }
    ])
    .controller('SettingsCtrl', ['$scope', '$timeout', 'myService', 'PN', '$http', '$ionicPopup',
        function ($scope, $timeout, myService, PN, $http, $ionicPopup) {
            $scope.ADappState.currentName = 'Settings';
            $scope.ADappState.currentApp = 'settings';
            //console.log($scope.ADappState.AllowPush);
            $scope.toggles = {
                enablePush: $scope.ADappState.AllowPush,
                enableGeo: $scope.ADappState.AllowGeo
            };

            $scope.toggle = function (type) {
                switch (type) {
                case 'push':
                    $timeout(function () {
                        intel.xdk.cache.setCookie('Allow_Push', JSON.stringify($scope.ADappState.AllowPush = $scope.toggles.enablePush), -1);
                    }, 0);
                    break;
                case 'geo':
                    $timeout(function () {
                        intel.xdk.cache.setCookie('Allow_Geo', JSON.stringify($scope.ADappState.AllowGeo = $scope.toggles.enableGeo), -1);
                        if ($scope.toggles.enableGeo === false)
                            $ionicPopup.alert({
                                title: 'Heads Up!',
                                content: 'This will disable use of the store locations map.'
                            });
                    }, 0);
                    break;
                }
            };

            // Start Welcome Tour
            $scope.startWelcome = function () {
                $scope.openWelcome();
            };

            $scope.hideLoading();

        }
    ])
    .controller('WelcomeCtrl', ['$scope', '$timeout', 'myService', '$state', '$ionicSideMenuDelegate',
        function ($scope, $timeout, myService, $state, $ionicSideMenuDelegate) {
            $scope.login = function () {
                $scope.openLogin();
            };
            $scope.register = function () {
                $scope.openRegister();
            };
            $scope.close = function () {
                $scope.closeWelcome();
            };

            $ionicSideMenuDelegate.canDragContent(false);

            $scope.safeApply(function () {
                // rotate and lock to portrait
                intel.xdk.device.setRotateOrientation('portrait');
                intel.xdk.device.setAutoRotate(false);
            });
        }
    ])
    .controller('RegistrationCtrl', ['$scope', 'myService', '$http',
        function ($scope, myService, $http) {

            $scope.registerData = {};
            $scope.siteRegistration = function () {
                var promise = myService.userRegistration($scope.registerData);
                promise.then(function (success) {
                    $scope.closeModal();
                    $scope.closeWelcome();
                }, function (failure) {
                    $scope.failures = failure;
                });
            };
        }
    ]);
