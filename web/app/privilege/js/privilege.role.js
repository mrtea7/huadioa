privilege.controller("RoleManageCtrl",
    function ($scope, requestService) {
        requestService.appRoleList().success(function (data) {
            $scope.appRoleList = data;
            initDefaultRole();
        })

        var initDefaultRole = function () {
            var appRoleList = $scope.appRoleList;
            for (var i = 0; i < appRoleList.length; i++) {
                var app = appRoleList[i],
                    roleList = app["rolelist"],
                    defaultRoleIdList = app["default_roleid_list"];
                for (var k = 0; k < defaultRoleIdList.length; k++) {
                    var defalutRoleId = defaultRoleIdList[k];
                    var role = _.find(roleList, function (role) {
                        return role["roleid"] === defalutRoleId;
                    });
                    if (role) {
                        role.isDefault = true;
                    }
                }
            }
        }

        $scope.toggleRoleList = function (app) {
            $scope.selectedApp === app ? $scope.selectedApp = "" : $scope.selectedApp = app;
        }

        $scope.isSelectedApp = function (app) {
            if (!app) return;
            return $scope.selectedApp === app ? "js-app-item-selected highlight" : "";
        }
    })


