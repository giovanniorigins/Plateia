angular
  .module('category')
  .controller("NewController", function ($scope, Category, supersonic) {
    $scope.category = {};

    $scope.submitForm = function () {
      $scope.showSpinner = true;
      newcategory = new Category($scope.category);
      newcategory.save().then( function () {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });