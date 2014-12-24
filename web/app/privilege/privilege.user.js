privilege
    .factory('entityService', ['$http', '$rootScope', '$parse', 'requestService', '$document',
        function ($http, $rootScope, $parse, requestService, $document) {
            var $entity = $("#entity-panel"),
                selectedAccessor = $parse("selected"),
                userAccessor = $parse("$parent.$parent.user"),
                userScope,
                show = function (user) {
                    requestService.userDetail(user.userno).success(function (data, httpStatus) {
                        selectedAccessor.assign(userScope, user)
                        userAccessor.assign(userScope, data)
                        $entity.animate({right: "0"}, "fast");
                    })
                },
                hide = function () {
                    userAccessor.assign(userScope, "")
                    selectedAccessor.assign(userScope, "")
                    $entity.animate({right: "-35%"}, "fast");
                    if (userScope.$root && userScope.$root.$$phase != '$apply'
                        && userScope.$root.$$phase != '$digest') { // angular hack
                        userScope.$apply(); // for document hide
                    }
                },
                startAutoHide = function () {
                    //!$document.attr("onmousedown") &&
                    $document.mousedown(userScope, function (event) {
                        var $target = $(event.target);
                        if (!($target.parents("#entity-panel").length > 0
                            || $target.parents("#userList").length > 0)) {
                            hide(userScope)
                        }
                    })
                },
                stopAutoHide = function () {
                    //console.log($document.attr("onmousedown"))
                    //$document.attr("onmousedown") && startAutoHide();
                    $document.unbind("mousedown")
                }
            return {
                initScope: function (scope) {
                    userScope = scope;
                },
                show: show,
                hide: hide,
                startAutoHide: startAutoHide,
                stopAutoHide: stopAutoHide
            };
        }])

    .controller("ListCtrl", ["$scope", 'requestService', 'entityService', '$timeout',
        function ($scope, requestService, entityService, $timeout) {
            requestService.userList().success(function (data, httpStatus) {
                $timeout(function () {
                    $scope.userList = data;
                    //entityService.show(data[0]); // for temp test
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

    .controller('UserEditCtrl', ["$scope", "$modalInstance", "requestService", "user", "_",
        function ($scope, $modalInstance, requestService, user, _) {
            requestService.userDetail(user.userno).success(function (data) {
                $scope.user = data;
            })

            requestService.appList().success(function (data) {
                $scope.appList = data;
                requestService.userRoleList(user.userno).success(function (data) {
                    $scope.userRoleList = data;
                    $scope.userRoleListLoaded = true;
                    initUserRoleCheckedStatus($scope.appList, $scope.userRoleList)
                })
            })

            var initUserRoleCheckedStatus = function (appList, userRoleList) {
                for (var i = 0; i < appList.length; i++) {
                    var app = appList[i];
                    var myApp = _.find(userRoleList, function (myApp) {
                        return myApp.appId === app.appId;
                    });
                    if (!myApp) continue;
                    var myAppRoleIdList = myApp.roleIdList;
                    var appRoleList = app.roleList;
                    for (var k = 0; k < myAppRoleIdList.length; k++) {
                        var roleId = myAppRoleIdList[k]
                        var appRole = _.find(appRoleList, function (appRole) {
                            return appRole.roleId === roleId  // 闭包不会影响此处
                        })
                        if (appRole) {
                            appRole.checked = true;
                        }
                    }
                }
                //console.log(appList)
            }

            $scope.toggleRoleList = function (app) {
                if ($scope.selectedApp === app) {
                    $scope.selectedApp = "";
                    $scope.appRoleList = "";
                } else {
                    $scope.selectedApp = app;
                    $scope.appRoleList = app.roleList; // 这个是要改动的
                }
            }

            $scope.toggleCheck = function (role) {
                role.checked = !role.checked;
                // 更新 userRoleList
                var appId = $scope.selectedApp.appId,
                    roleId = role.roleId,
                    userRole = _.find($scope.userRoleList, function (userRole) {
                        return userRole.appId === appId;
                    }),
                    userRoleIdList;
                userRole.roleIdList && (userRoleIdList = userRole.roleIdList);
                if (role.checked) {
                    userRoleIdList.push(roleId)
                } else {
                    userRoleIdList.splice(_.indexOf(userRoleIdList, roleId), 1);
                }
                //console.log($scope.userRoleList)
            }

            $scope.isSelectedApp = function (app) {
                return $scope.selectedApp === app ? "js-app-item-selected highlight" : "";
            }

            $scope.submit = function () {
                // 自定义的异步提交
                $scope.user.userRoleList = $scope.userRoleList;
                requestService.saveUser("http://www.baidu.com", $scope.user)

            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }])

    .directive("myUserModal", ["$modal", "$document", "entityService",
        function ($modal, $document, entityService) {
            return {
                restrict: 'A',
                scope: {
                    userno: "@"
                },
                link: function (scope, element) {
                    element.click(function () {
                        var modalInstance = $modal.open({
                            backdrop: "static",
                            keyboard: false,
                            //size: "lg",
                            templateUrl: "templates/userEdit.html", // scope is in ModalInstanceCtrl
                            controller: 'UserEditCtrl' // 里面能访问到 userno ?
                            , resolve: {
                                user: function () {
                                    return {"userno": scope.userno};
                                }
                            }
                        })

                        modalInstance.result.then(function () {
                            entityService.startAutoHide();

                        }, function () {
                            entityService.startAutoHide();
                        });

                        modalInstance.opened.then(function () {
                            entityService.stopAutoHide();
                        })
                    })
                }
            }
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