var index = angular.module('myApp.index', [
  "handyUtilities",
  "slider",
  "request",
  'ui.bootstrap'
])

index.controller('IndexCtrl', function ($scope, $modal, sliderService) {
  var modalInstance;

  // index 上的不处理业务逻辑，只处理开关。
  $scope.openModal = function (opts) {
    modalInstance = $modal.open({
      backdrop: "static",
      keyboard: (!!opts.keyboard) ? opts.keyboard : false,
      size: opts.size || "lg",
      templateUrl: opts.templateUrl
      //,
      //controller: 'ModalCtrl',
      //scope: $scope
      /*, resolve: {
       user: function () {
       return scope.user // 指令内部控制器，不能访问到外部 scope
       }
       }*/
    })

    //$scope.test = 123;

    modalInstance.result.then(function () {
      sliderService.startAutoHide();
    }, function () {
      sliderService.startAutoHide();
    });

    modalInstance.opened.then(function () {
      sliderService.stopAutoHide();
    })
  }

  $scope.closeModal = function () {
    modalInstance.dismiss('cancel')
  }



})
/*

index.controller("ModalCtrl",function($scope, $modalInstance){
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel')
  }
  console.log($scope.test)
})

*/

