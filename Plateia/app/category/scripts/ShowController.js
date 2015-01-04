angular
  .module('category')
  .controller("ShowController", function ($scope, Category, supersonic) {
    $scope.category = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _refreshViewData = function () {
      Category.find($scope.dataId).then( function (category) {
        $scope.$apply( function () {
          $scope.category = category;
          $scope.showSpinner = false;
        });
      });
    }

    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.dataId ) {
        _refreshViewData();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.dataId = values.id;
      _refreshViewData();
    });

    $scope.remove = function (id) {
      $scope.showSpinner = true;
      $scope.category.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    }
  });