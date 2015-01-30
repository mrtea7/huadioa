var privilege = angular.module('myApp.index', [
  "handyUtilities",
  "slider",
  "request",
  'ui.bootstrap'
])

privilege.controller('IndexCtrl',
    function ($scope, $modal, sliderService) {
      $scope.openModal = function (opts) {
        var modalInstance = $modal.open({
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
    })


