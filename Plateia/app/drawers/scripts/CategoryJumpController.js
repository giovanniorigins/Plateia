angular.module('drawers')
    .controller('CategoryJumpController', ['$scope', 'supersonic', function ($scope, supersonic) {

        $scope.selectedCategory = '';
        supersonic.bind($scope, "selectedCategory");

        var Category = supersonic.data.model('Category');
        Category.findAll().then(function (categories) {
            $scope.$apply(function () {
                $scope.categories = categories;
            });
        });

        $scope.filterTo = function (id) {
            if (id) {
                supersonic.logger.log('Category: ' + id);
                $scope.selectedCategory = parseInt(id);
            } else {
                supersonic.logger.log('All Categories');
                $scope.selectedCategory = '';
            }
            supersonic.ui.drawers.close().then( function() {
                //supersonic.logger.debug("Drawer was closed");
            });
        };
    }])