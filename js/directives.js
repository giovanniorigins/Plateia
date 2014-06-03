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
            /*elem.click(function () {
                angular.element('#main-nav a').removeClass('active');
                elem.addClass('active');
                if (attrs.hreh == window.location.hash)
                    return false;
                if (angular.isUndefined(scope.loading))
                    scope.showLoading();
            });*/
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
                elem.on('click', function (event) {
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

