privilege.controller("RoleManageCtrl",
    function ($scope, requestService, sliderService, $rootScope) {
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

        sliderService.initPath("voteRoleMenuList.json"); // 获取 投票成员角色 已经拥有的功能菜单
        $scope.mySliderToggle = function (role) {
            sliderService.setParams({roleid: role.roleid})
            if (!$scope.selectedRole) {
                $scope.selectedRole = role;
                sliderService.show()
            } else if ($scope.selectedRole && $scope.selectedRole === role) {
                $scope.selectedRole = "";
                sliderService.hide()
            } else {
                $scope.selectedRole = role;
                sliderService.showAfterHide()
            }
        }

        $rootScope.$on("row.clearSelected", function () {
            $scope.selectedRole = "";
            $scope.$apply();
        })
        $rootScope.$on("entity.update", function (event, selectedMenuList) {
            $scope.selectedMenuList = selectedMenuList;
        })

        $scope.isSelectedRole = function (role) {
            return $scope.selectedRole === role ? "active gray" : "";
        }

        $scope.isSelectedApp = function (app) {
            if (!app) return;
            return $scope.selectedApp === app ? "js-app-item-selected highlight" : "";
        }
    })

privilege.controller('RoleModalCtrl',
    function ($scope, $modalInstance, requestService, _, selectedRole, selectedMenuList) {
        $scope.role = selectedRole;
        $scope.selectedMenuList = selectedMenuList;

        requestService.menuList().success(function (data) {
            $scope.treeData = data;
            console.log("data",data)
            $scope.treeConfig = {
                core: {
                    strings : {'Loading ...' : '拼命加载中！'},
                    multiple : false,
                    check_callback: true,
                    themes: {
                        name: false,
                        url: false,
                        dir: false,
                        icons: true,
                        variant: false,
                        stripes: false,
                        responsive: true,
                        dots: true
                    }
                },
                //types: {"default": {icon: "icon icon_folder_blue"}},
                plugins: [ "checkbox", "wholerow"]
                //plugins: ["types", "checkbox", "wholerow"]
            }
        })

        // 区分新增与修改 1/2
        /*$scope.user = (user || {});
        $scope.user.isNewUser = !$scope.user.userno;
        if ($scope.user.isNewUser) {
            $scope.modal = {title: "新增用户"};
        }

        // 区分新增与修改 2/2
        requestService.appRoleList().success(function (data) {
            $scope.appRoleList = data;
            if ($scope.user.isNewUser) {
                // 设置新用户默认有的角色
                $scope.userRoleList = getUserDefaultRole($scope.appRoleList);
                // 显示角色面板
                $scope.userRoleListLoaded = true;
                // 勾选用户已有的角色
                initUserRoleCheckedStatus($scope.appRoleList, $scope.userRoleList)
            } else {
                requestService.userRoleList(user.userno).success(function (data) {
                    $scope.userRoleList = data;
                    $scope.userRoleListLoaded = true;
                    initUserRoleCheckedStatus($scope.appRoleList, $scope.userRoleList)
                })
            }
        })

        var getUserDefaultRole = function (appRoleList) {
            var arr = [];
            for (var i = 0; i < appRoleList.length; i++) {
                var app = appRoleList[i], userRole;
                userRole = {
                    "appid": app["appid"],
                    "roleid_list": app["default_roleid_list"]
                }
                arr.push(userRole)
            }
            return arr;
        }

        var initUserRoleCheckedStatus = function (appRoleList, userRoleList) {
            for (var i = 0; i < appRoleList.length; i++) {
                var app = appRoleList[i];
                var myApp = _.find(userRoleList, function (myApp) {
                    return myApp.appid === app.appid; // 闭包不会影响此处
                });
                if (!myApp) continue;
                var myRoleIdList = myApp["roleid_list"];
                for (var k = 0; k < myRoleIdList.length; k++) {
                    var myRoleId = myRoleIdList[k]
                    var role = _.find(app["rolelist"], function (role) {
                        return role.roleid === myRoleId
                    })
                    if (role) {
                        role.checked = true;
                    }
                }
            }
        }

        $scope.toggleRoleList = function (app) {
            $scope.selectedApp === app ? $scope.selectedApp = "" : $scope.selectedApp = app;
        }

        $scope.toggleCheck = function (role) {
            role.checked = !role.checked;
            // 更新 userRoleList 中的 roleid
            var appid = $scope.selectedApp.appid,
                roleid = role.roleid,
                userRole = _.find($scope.userRoleList, function (userRole) {
                    return userRole.appid === appid;
                }),
                userRoleIdList = [];
            if (userRole["roleid_list"]) {
                userRoleIdList = userRole["roleid_list"]
            }
            if (role.checked) {
                userRoleIdList.push(roleid) // 添加
            } else {
                userRoleIdList.splice(_.indexOf(userRoleIdList, roleid), 1); // 删除
            }
        }

        $scope.isSelectedApp = function (app) {
            if (!app) return;
            var userRole = findUserRoleByappid(app.appid);
            if (!userRole) return;
            if (userRole["roleid_list"] && userRole["roleid_list"].length === 0) {
                return "img-gray"
            } else {
                return $scope.selectedApp === app ? "js-app-item-selected highlight" : "";
            }
        }

        function findUserRoleByappid(appid) {
            var userRole = _.find($scope.userRoleList, function (userRole) {
                return userRole.appid === appid;
            })
            return userRole;
        }*/

        $scope.submit = function () {
            // 自定义的异步提交
            $scope.user.userRoleList = $scope.userRoleList;
            //requestService.saveUser("http://www.baidu.com", $scope.user)
            console.log($scope.user)
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

privilege.directive("myRoleModal", ["$modal", "$document", "sliderService",
    function ($modal, $document, sliderService) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.click(function () {
                    var modalInstance = $modal.open({
                        backdrop: "static",
                        keyboard: false,
                        //size: "lg", // 如何自定义宽度，或修改脚本
                        templateUrl: attr.template, // scope is in ModalInstanceCtrl
                        controller: 'RoleModalCtrl'
                        , resolve: {
                            selectedRole: function () {
                                return scope.selectedRole // 指令内部控制器，不能访问到外部 scope
                            },
                            selectedMenuList:function(){
                                return scope.selectedMenuList
                            }
                        }
                    })

                    modalInstance.result.then(function () {
                        sliderService.startAutoHide();
                    }, function () {
                        sliderService.startAutoHide();
                    });

                    modalInstance.opened.then(function () {
                        sliderService.stopAutoHide();
                    })
                })
            }
        }
    }])