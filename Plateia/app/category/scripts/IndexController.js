angular
  .module('category')
  .controller("IndexController", ['$scope', 'Category', 'supersonic', function ($scope, Category, supersonic) {
    $scope.categorys = null;
    $scope.showSpinner = true;

    Category.findAll().then( function (categorys) {
        $scope.$apply( function () {
          $scope.categorys = categorys;
          $scope.showSpinner = false;
        });
    });

        /*supersonic.logger.log("HERE");*/
  }]);