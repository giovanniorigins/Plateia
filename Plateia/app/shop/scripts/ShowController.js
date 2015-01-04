angular
  .module('shop')
  .controller("ShowController", function ($scope, Shop, supersonic) {
    $scope.shop = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _refreshViewData = function () {
      Shop.find($scope.dataId).then( function (shop) {
        $scope.$apply( function () {
          $scope.shop = shop;
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
      $scope.shop.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    }
  });