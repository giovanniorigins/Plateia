angular
    .module('deal')
    .controller('ModalController', ['$scope', '$timeout', 'supersonic', 'Deal', '$window', function ($scope, $timeout, supersonic, Deal, $window) {
        $scope.state = 'main';
        $scope.showSpinner = true;
        ProgressIndicator.showSimpleWithLabel(false, 'Loading...');
        $scope.deal = null;

        /* NAVIGATION */
        /*steroids.view.navigationBar.show({
            title: '',
            animated: true
        });

        supersonic.ui.navigationBar.setClass("green-bar");
        var closeBtn = new steroids.buttons.NavigationBarButton();
        closeBtn.imagePath = "/images/icons/close@2x.png";
        closeBtn.imageAsOriginal = "true";
        closeBtn.onTap = function () {
            $scope.closeModal();
        };

        //var shareBtn = new steroids.buttons.NavigationBarButton();
        //shareBtn.imagePath = "/images/icons/share@2x.png";
        //shareBtn.imageAsOriginal = "true";
        //shareBtn.styleId = 'share_button';
        //shareBtn.onTap = function() {
        //    $scope.share($scope.deal);
        //};

        var backBtn = new steroids.buttons.NavigationBarButton();
        backBtn.title = 'Back';

        steroids.view.navigationBar.update({
            overrideBackButton: false,
            backButton: backBtn,
            buttons: {
                //left: [closeBtn],
                right: [closeBtn]
            }
        });*/
        /* //NAVIGATION */


        // Bind Shopping List
        $scope.shoppingList = angular.isDefined(localStorage.Shopping_list)
            ? JSON.parse(localStorage.Shopping_list)
            : [];
        supersonic.bind($scope, "shoppingList");

        // Fetch an object based on id from the database
        Deal.find(steroids.view.params.id).then(function (deal) {
            $scope.$apply(function () {
                $scope.deal = deal;
                //steroids.view.navigationBar.update({ title: deal.title});
                $scope.showSpinner = false;
                ProgressIndicator.hide();
            });
        });

        $scope.toExpire = function (date) {
            return moment(date).fromNow();
        };

        $scope.toDate = function (date) {
            return moment(date).toDate();
        };

        $scope.closeModal = function () {
            supersonic.ui.modal.hide();
        };

        $scope.toCart = function (deal) {
            if (angular.isDefined(localStorage.Shopping_list)) {
                $scope.shoppingList = JSON.parse(localStorage.Shopping_list);
                if ($scope.shoppingList.indexOf(deal.id) != -1) {
                    // Remove from list
                    $scope.shoppingList.splice($scope.shoppingList.indexOf(deal.id), 1);
                } else {
                    // Add to list
                    $scope.shoppingList.push(deal.id);
                }
                localStorage.Shopping_list = JSON.stringify($scope.shoppingList);

            } else {
                localStorage.Shopping_list = JSON.stringify([deal.id]);
            }
        };

        $scope.inCart = function (deal) {
            if (angular.isDefined(localStorage.Shopping_list)) {
                var shoppingList = JSON.parse(localStorage.Shopping_list);
                return shoppingList.indexOf(deal.id) != -1;
            } else {
                return false;
            }
        };

        $scope.saving = function (deal) {
            return deal.list_price - deal.new_price;
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {

        });

        $scope.share = function (deal) {
            $window.plugins.socialsharing.iPadPopupCoordinates = function () {
                var rect = document.getElementById('share_button').getBoundingClientRect();
                return rect.left + "," + rect.top + "," + rect.width + "," + rect.height;
            };
            $window.plugins.socialsharing.share(
                'Check out this deal!', //message
                'Agora App: ' + deal.title, //subject
                deal.photos[0].path, //image
                'http://marketplace.gorigins.com/' //link
            );
        };
    }]);
