angular
  .module('shop')
  .controller("EditController", function ($scope, Shop, supersonic) {
    $scope.shop = null;
    $scope.showSpinner = true;

    // Fetch an object based on id from the database
    Shop.find(steroids.view.params.id).then( function (shop) {
      $scope.$apply(function() {
        $scope.shop = shop;
        $scope.showSpinner = false;
      });
    });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.shop.save().then( function () {
        supersonic.ui.modal.hide();
      });
    }

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });
