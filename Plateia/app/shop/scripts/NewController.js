angular
  .module('shop')
  .controller("NewController", function ($scope, Shop, supersonic) {
    $scope.shop = {};

    $scope.submitForm = function () {
      $scope.showSpinner = true;
      newshop = new Shop($scope.shop);
      newshop.save().then( function () {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });