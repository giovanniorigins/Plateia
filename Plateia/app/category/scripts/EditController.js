angular
  .module('category')
  .controller("EditController", function ($scope, Category, supersonic) {
    $scope.category = null;
    $scope.showSpinner = true;

    // Fetch an object based on id from the database
    Category.find(steroids.view.params.id).then( function (category) {
      $scope.$apply(function() {
        $scope.category = category;
        $scope.showSpinner = false;
      });
    });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.category.save().then( function () {
        supersonic.ui.modal.hide();
      });
    }

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });
