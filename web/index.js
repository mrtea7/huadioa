var index = angular.module('myApp.index', [
  "handyUtilities",
  "slider",
  "request",
  'ui.bootstrap'
])

index.controller('IndexCtrl',
    function ($scope, $modal, sliderService) {
      var modalInstance;
      $scope.openModal = function (opts) {
        modalInstance = $modal.open({
          backdrop: "static",
          keyboard: (!!opts.keyboard) ? opts.keyboard : false,
          size: opts.size || "lg",
          templateUrl: opts.templateUrl
        })

        modalInstance.result.then(function () {
          sliderService.startAutoHide();
        }, function () {
          sliderService.startAutoHide();
        });

        modalInstance.opened.then(function () {
          sliderService.stopAutoHide();
        })
      }

      $scope.closeModal = function(){
        modalInstance.dismiss('cancel')
      }
      
    })


