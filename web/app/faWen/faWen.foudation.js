var faWen = angular.module('myApp.faWen', [
  'ui.router',
  'ui.bootstrap',
  'pasvaz.bindonce',
  'underscore',
  'ngAnimate',
  "handyUtilities",
  "request",
  "slider",
  "ngJsTree",
  'ngSanitize',
  'ngToast',
  'changeNotification',
  'angularSlideables',
  'hotkeys'
])

faWen.config(['ngToastProvider', '$tooltipProvider', function (ngToastProvider, $tooltipProvider) {
  ngToastProvider.configure({
    verticalPosition: 'top',
    horizontalPosition: 'center',
    //dismissButton: true,
    dismissOnClick: true,
    timeout: 4000
  });
  $tooltipProvider.options({
    popupDelay: 500
  });
}])

faWen.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    console.clear();
  }])

faWen.controller('FaWenCtrl', ['$scope', '$rootScope', '$state', 'requestService',
  function ($scope, $rootScope, $state, requestService) {
    requestService.faWenMenuList().success(function (menuList, httpStatus) {
      $scope.menuList = menuList;
      $scope.menuTemplateUrl = menuList[0]['templateurl']
      $scope.selectedMenu = menuList[0];
    })

    // for menu and menuChild
    $scope.setPage = function (menu) {
      //$scope.menuTemplateUrl = menu['templateurl']
    };

    $scope.toggleSelectMenu = function(menu){
      if( !$scope.selectedMenu || $scope.selectedMenu !== menu ){
        $scope.selectedMenu = menu;
        if(menu.children && menu.children.length && menu.slideExpanded == false){
          $scope.selectedMenu = ""
        }
      }else {
        $scope.selectedMenu = ""
      }
    }

    // for menu and menuChild
    $scope.isSelectedMenu = function (menu) {
      return $scope.selectedMenu === menu ? 'open' : '';
    };

    $scope.hasMenuChildren = function (menu) {
      if(menu.children && menu.children.length > 0) {
        return true
      }
    }
  }])


