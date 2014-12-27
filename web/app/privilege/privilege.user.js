privilege
    .factory('entityService', ['$http', '$rootScope', '$parse', 'requestService', '$document',
        function ($http, $rootScope, $parse, requestService, $document) {
            console.log("entityService")

            var $entity = $("#user-entity-panel"),
                selectedAccessor = $parse("selected"),
                userAccessor = $parse("$parent.$parent.user"),
                userScope;
            $entity.on("click", function(){
                console.log("click")
                $entity.animate({right: "0"}, "fast");
            })
            var show = function (user) {
                    requestService.userDetail(user.userno).success(function (data, httpStatus) {
                        selectedAccessor.assign(userScope, user)
                        //console.log(userScope.selected);
                        userAccessor.assign(userScope, data)
                        //console.log(userAccessor.assign(userScope, data));
                        //console.log($entity)
                        console.log($entity.length)

                        $entity.trigger("click")

                        //[, "fast"]
                        //console.log("show")
                    })
                },
                hide = function () {
                    //console.log("hide")

                    userAccessor.assign(userScope, "")
                    selectedAccessor.assign(userScope, "")
                    $entity.animate({right: "-35%"}, "fast");
                    if (userScope.$root && userScope.$root.$$phase != '$apply'
                        && userScope.$root.$$phase != '$digest') { // angular hack
                        userScope.$apply(); // for document hide
                    }
                },
                startAutoHide = function () {
                    $document.mousedown(userScope, function (event) {
                        var $target = $(event.target);
                        if (!($target.parents("#user-entity-panel").length > 0
                            || $target.parents("#userList").length > 0)) {
                            hide(userScope)
                        }
                    })
                },
                stopAutoHide = function () {
                    $document.unbind("mousedown")
                    //console.log("stopAutoHide")

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

    .controller("UserManageCtrl", ["$scope", 'requestService', 'entityService', '$timeout',
        function ($scope, requestService, entityService, $timeout) {
            console.log("UserManageCtrl")
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

            $scope.selectAllCheckbox = {isChecked: false};
            $scope.selectAllUser = function(){
                var bool = $scope.selectAllCheckbox.isChecked;
                _.each($scope.userList, function(user){ user.selected = bool });
            }

            $scope.selectUser = function($event){
                $event.stopPropagation();
            }

            $scope.batchIsActived = function(){
                var found = _.find($scope.userList, function(user){ return user.selected === true });
                return found;
            }

            $scope.deleteUsers = function(){
                var selectedUsers = _.filter($scope.userList, function(user){ return user.selected === true });
                requestService.deleteUsers(selectedUsers).success(function (data, httpStatus) {

                })
                //console.log(selectedUsers)
            }

        }])

    .controller('MyUserModalCtrl', ["$scope", "$modalInstance", "requestService", "user", "_",
        function ($scope, $modalInstance, requestService, user, _) {
            // 区分新增与修改 1/2
            $scope.isNewUser = !user.userno;
            if ($scope.isNewUser ) {
                $scope.user = {isNewUser: true};
                //user.username
                $scope.modal = {title: "新增用户"};
            } else {
                requestService.userDetail(user.userno).success(function (data) {
                    $scope.user = data;
                }).error(function () {
                    console.log("获取用户信息失败")
                })
            }

            // 区分新增与修改 1/2
            requestService.appList().success(function (data) {
                $scope.appList = data;
                if ($scope.isNewUser) {
                    // 设置用户默认角色
                    initUserDefaultRole($scope.appList);
                    $scope.userRoleListLoaded = true;
                    initUserRoleCheckedStatus($scope.appList, $scope.userRoleList)
                } else {
                    requestService.userRoleList(user.userno).success(function (data) {
                        $scope.userRoleList = data;
                        $scope.userRoleListLoaded = true;
                        initUserRoleCheckedStatus($scope.appList, $scope.userRoleList)
                    })
                }
            })

            var initUserDefaultRole = function (appList) {
                $scope.userRoleList = [];
                for (var i = 0; i < appList.length; i++) {
                    var app = appList[i], userRole;
                    userRole = {
                        "appid": app.appid,
                        "roleid_list": app.defaultroleid
                    }
                    $scope.userRoleList.push(userRole)
                }

            }

            var initUserRoleCheckedStatus = function (appList, userRoleList) {
                for (var i = 0; i < appList.length; i++) {
                    var app = appList[i];
                    var myApp = _.find(userRoleList, function (myApp) {
                        return myApp.appid === app.appid;
                    });
                    if (!myApp) continue;
                    var myApproleid_list = myApp.roleid_list;
                    var appRoleList = app.roleList;
                    for (var k = 0; k < myApproleid_list.length; k++) {
                        var roleid = myApproleid_list[k]
                        var appRole = _.find(appRoleList, function (appRole) {
                            return appRole.roleid === roleid  // 闭包不会影响此处
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
                var appid = $scope.selectedApp.appid,
                    roleid = role.roleid,
                    userRole = _.find($scope.userRoleList, function (userRole) {
                        return userRole.appid === appid;
                    }),
                    userroleid_list;
                userRole.roleid_list && (userroleid_list = userRole.roleid_list);
                if (role.checked) {
                    userroleid_list.push(roleid)
                } else {
                    userroleid_list.splice(_.indexOf(userroleid_list, roleid), 1);
                }
                //console.log($scope.userRoleList)
            }

            function findUserRoleByappid(appid) {
                var userRole = _.find($scope.userRoleList, function (userRole) {
                    return userRole.appid === appid;
                })
                return userRole;
            }


            $scope.isSelectedApp = function (app) {
                if (!app) return;
                var userRole = findUserRoleByappid(app.appid);
                if (!userRole) return;
                if (userRole.roleid_list && userRole.roleid_list.length === 0) {
                    return "img-gray"
                } else {
                    return $scope.selectedApp === app ? "js-app-item-selected highlight" : "";
                }
            }

            $scope.submit = function () {
                // 自定义的异步提交
                $scope.user.userRoleList = $scope.userRoleList;
                //requestService.saveUser("http://www.baidu.com", $scope.user)
                console.log($scope.user)
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
                    /*userno: "@"*/
                },
                link: function (scope, element, attr) {
                    element.click(function () {
                        var modalInstance = $modal.open({
                            backdrop: "static",
                            keyboard: false,
                            //size: "lg",
                            templateUrl: attr.template, // scope is in ModalInstanceCtrl
                            controller: 'MyUserModalCtrl'  // 指令内部控制器
                            , resolve: {
                                user: function () {
                                    return {"userno": attr.userno};
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