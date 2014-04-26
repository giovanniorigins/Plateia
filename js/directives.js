angular.module('plateia.directives', [])
    .directive('fadeBar', function ($timeout) {
        return {
            restrict: 'E',
            template: '<div class="fade-bar"></div>',
            replace: true,
            link: function ($scope, $element, $attr) {
                $timeout(function () {
                    $scope.$watch('sideMenuController.getOpenRatio()', function (ratio) {
                        $element[0].style.opacity = Math.abs(ratio);
                    });
                });
            }
        }
    })
    .directive('navItem', function () {
        return function (scope, elem, attrs) {
            elem.click(function () {
                angular.element('#main-nav a').removeClass('active');
                elem.addClass('active');
                if (attrs.hreh == window.location.hash)
                    return false;
                if (angular.isUndefined(scope.loading))
                    scope.showLoading();
            });
        };
    })
    .directive('searchBar', function () {
        return function (scope, elem, attrs) {

        }
    })
    /*.directive('modalBackdrop', function () {
    return function (scope, elem, attrs) {
        elem.click(function () {
            alert('yup');
        });
    };
})
    .directive('modal-backdrop', function () {
        return function (scope, elem, attrs) {
            elem.click(function () {
                alert('yup');
            });
        };
    })*/
    .directive('nourl', function () {
        return function (scope, elem, attrs) {
            scope.safeApply(function () {
                angular.element(elem).click(function (event) {
                    event.preventDefault();
                });
            });
        };
    })
    .directive('dealItem', ['$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                templateUrl: $rootScope.ADappState.deviceType == 'isTablet' ? 'partials/deal-tablet.tpl.html' : 'partials/deal-phone.tpl.html',
                link: function (scope, element, attrs) {}
            }
    }])
    .directive('dealItemPhone', ['$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                templateUrl: 'partials/deal-phone.tpl.html',
                link: function (scope, element, attrs) {}
            }
    }])
    .directive('dealItemTablet', ['$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                templateUrl: 'partials/deal-tablet.tpl.html',
                link: function (scope, element, attrs) {}
            }
    }])
/*.directive('shopItem', ['$rootScope',
        function ($rootScope) {
        return {
            restrict: 'A',
            templateUrl: 'partials/shop-item.tpl.html',
            link: function (scope, element, attrs) {}
        }
    }])*/
.directive('fastClick', ['$parse',
        function ($parse) {

        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                /**
                 * Parsed function from the directive
                 * @type {*}
                 */
                var fn = $parse(attrs.fastClick),


                    /**
                     * Track the start points
                     */
                    startX,

                    startY,

                    /**
                     * Whether or not we have for some reason
                     * cancelled the event.
                     */
                    canceled,

                    /**
                     * Our click function
                     */
                    clickFunction = function (event) {
                        if (!canceled) {
                            scope.safeApply(function () {
                                fn(scope, {
                                    $event: event
                                });
                            });
                        }
                    };


                /**
                 * If we are actually on a touch device lets
                 * setup our fast clicks
                 */
                if (Modernizr.touch) {

                    element.on('touchstart', function (event) {
                        event.stopPropagation();

                        var touches = event.originalEvent.touches;

                        startX = touches[0].clientX;
                        startY = touches[0].clientY;

                        canceled = false;
                    });

                    element.on('touchend', function (event) {
                        event.stopPropagation();
                        clickFunction();
                    });

                    element.on('touchmove', function (event) {
                        var touches = event.originalEvent.touches;

                        // handles the case where we've swiped on a button
                        if (Math.abs(touches[0].clientX - startX) > 10 ||
                            Math.abs(touches[0].clientY - startY) > 10) {
                            canceled = true;
                        }
                    });
                }

                /**
                 * If we are not on a touch enabled device lets bind
                 * the action to click
                 */
                if (!Modernizr.touch) {
                    element.on('click', function (event) {
                        clickFunction(event);
                    });
                }
            }
        };
    }]);
