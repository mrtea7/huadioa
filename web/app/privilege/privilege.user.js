privilege.controller("ListCtrl", ["$scope", 'requestService', 'entityService', '$timeout',
    function ($scope, requestService, entityService, $timeout) {
        requestService.userList().success(function (data, httpStatus) {
            $timeout(function () {
                $scope.userList = data;
                entityService.show(data[0]); // for temp test
                entityService.initScope($scope)
                entityService.startAutoHide()
            }, 0)
        });
        $scope.selected = "";
        $scope.toggle = function (user, $event) {
            if (!$scope.selected) {
                entityService.show(user);
            } else if ($scope.selected && $scope.selected === user) {
                entityService.hide();
            } else {
                entityService.hide();
                entityService.show(user);
            }
            $event.stopPropagation();
        }

        $scope.isSelected = function (user) {
            // 自执行，传递 user，与 selected 比较
            return $scope.selected === user ? "js_entity_selected active" : "";
        }
    }])

    .controller('UserEditCtrl', ["$scope", "$modalInstance",
        function ($scope, $modalInstance) {
            //console.log($scope)
            //$scope.user = user.data;
            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }])

    .directive("myUserEntity", ["entityService",
        function (entityService) {
            return {
                restrict: 'A',
                templateUrl: 'templates/userEntity.html',
                link: function (scope) {
                    scope.colseEntity = function () {
                        entityService.hide();
                    }
                }
            }
        }])