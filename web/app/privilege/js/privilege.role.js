//privilege
//    .factory('roleEntityService', ['$http', '$rootScope', '$parse', 'requestService', '$document',
//        function ($http, $rootScope, $parse, requestService, $document) {
//            var $entity = $("#role-entity-panel"),
//                //selectedAccessor = $parse("selected"),
//                //roleAccessor = $parse("$parent.$parent.role"),
//                roleScope,
//                show = function (role) {
//                    requestService.roleDetail(role.roleid).success(function (data, httpStatus) {
//                        //selectedAccessor.assign(roleScope, role)
//                        //roleAccessor.assign(roleScope, data)
//                        $entity.animate({right: "0"}, "fast");
//                    })
//                },
//                hide = function () {
//                    //roleAccessor.assign(roleScope, "")
//                    //selectedAccessor.assign(roleScope, "")
//                    $entity.animate({right: "-35%"}, "fast");
//                    if (roleScope.$root && roleScope.$root.$$phase != '$apply'
//                        && roleScope.$root.$$phase != '$digest') { // angular hack
//                        roleScope.$apply(); // for document hide
//                    }
//                },
//                startAutoHide = function () {
//                    $document.mousedown(roleScope, function (event) {
//                        var $target = $(event.target);
//                        if (!($target.parents("#entity-panel").length > 0
//                            || $target.parents("#roleList").length > 0)) {
//                            hide(roleScope)
//                        }
//                    })
//                },
//                stopAutoHide = function () {
//                    $document.unbind("mousedown")
//                }
//            return {
//                initScope: function (scope) {
//                    roleScope = scope;
//                },
//                show: show,
//                hide: hide,
//                startAutoHide: startAutoHide,
//                stopAutoHide: stopAutoHide
//            };
//        }])

privilege.controller("RoleManageCtrl",
    function ($scope, requestService) {
        requestService.appRoleList().success(function (data) {
            $scope.appList = data;
            initDefaultRole();
            //roleEntityService.initScope($scope)
            //roleEntityService.startAutoHide() // 角色面板不自动隐藏 ？
        })

        var initDefaultRole = function () {
            var appList = $scope.appList;
            for (var i = 0; i < appList.length; i++) {
                var app = appList[i],
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
            $scope.selectedApp = app;
            $scope.selectedRole = "";
            app.shown = !app.shown;
            if (!app.shown) {
                // 如果合拢
                $scope.selectedApp = "";
            }
            _.each(app['rolelist'], function (role) {
                role.shown = !role.shown
            });
        }

        $scope.toggleRole = function (role) {
            $scope.selectedApp = "";
            /*if ( $scope.selectedRole ) {
             roleEntityService.show(role);
             }*/

            if ($scope.selectedRole === role) {
                $scope.selectedRole = "";
            } else {
                $scope.selectedRole = role;
                //roleEntityService.show(role);
            }

            /*
             if (!$scope.selectedRole) {
             roleEntityService.show(role);
             } else if ($scope.selectedRole && $scope.selectedRole === role) {
             roleEntityService.hide();
             } else {
             roleEntityService.hide();
             roleEntityService.show(role);
             }
             */

        }

        $scope.isSelected = function (obj) {
            if ($scope.selectedApp) {
                return $scope.selectedApp === obj ? "js_entity_selected active" : "";
            } else if ($scope.selectedRole) {
                return $scope.selectedRole === obj ? "js_entity_selected active" : "";
            }
        }
    })

//privilege.directive("myRoleEntity", ["roleEntityService",
//        function (roleEntityService) {
//            return {
//                restrict: 'A',
//                templateUrl: 'templates/userEntity.html',
//                link: function (scope) {
//                    scope.colseEntity = function () {
//                        roleEntityService.hide();
//                    }
//                }
//            }
//        }])

