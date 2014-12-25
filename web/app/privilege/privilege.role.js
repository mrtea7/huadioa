privilege
    .controller("RoleManageCtrl", ["$scope", 'requestService', '$templateCache',
        function ($scope, requestService, $templateCache) {
            requestService.appList().success(function (data) {
                $scope.appList = data;
            })
            $scope.showRole = function($event){

            }
        }])



