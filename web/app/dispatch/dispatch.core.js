faWen.controller("NiGaoCtrl",
    function ($scope, $timeout, $state, $stateParams, $rootScope, sliderService, requestService, $modal) {
        requestService.faWenList().success(function (data, httpStatus) {
            $timeout(function () {
                $scope.itemList = data;
            }, 0)
        });

        sliderService.initPath("faWen.itemDetail.json"); // be mock
        $scope.mySliderToggle = function (item) {
            sliderService.setParams({flowinstid: item.flowinstid})
            if (!$scope.selected) {
                $scope.selected = item;
                sliderService.show()
            } else if ($scope.selected && $scope.selected === item) {
                $scope.selected = "";
                sliderService.hide()
            } else {
                $scope.selected = item;
                sliderService.showAfterHide()
            }
        }

        $rootScope.$on("row.clearSelected", function () {
            $scope.selected = "";
            $scope.$apply();
        })
        $rootScope.$on("entity.update", function (event, item) {
            $scope.item = item;
        })

        $scope.isSelected = function (item) {
            return $scope.selected === item ? "active" : "";
        }

        $scope.selectAllItem = function () {
            var bool = $scope.selectAllCheckbox.isChecked;
            _.each($scope.itemList, function (item) {
                item.selected = bool
            });
        }

        $scope.selectItem = function ($event) {
            $event.stopPropagation();
        }

        $scope.batchIsActived = function () {
            var found = _.find($scope.itemList, function (item) {
                return item.selected === true
            });
            return found;
        }

        $scope.deleteItems = function () {
            var selectedItems = _.filter($scope.itemList, function (item) {
                return item.selected === true
            });
            console.log(selectedItems)
        }

        $scope.openModal = function(){
            var modalInstance = $modal.open({
                backdrop: "static",
                keyboard: false,
                size: "lg",
                templateUrl: 'templates/body-edit.html', // scope is in ModalInstanceCtrl
                //templateUrl: attr.template, // scope is in ModalInstanceCtrl
                controller: 'ZwModalCtrl'
                /*, resolve: {
                 user: function () {
                 return scope.user // 指令内部控制器，不能访问到外部 scope
                 }
                 }*/
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

faWen.directive("myZwModal", ["$modal", "$document", "sliderService",
    function ($modal, $document, sliderService) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.click(function () {

                })
            }
        }
    }])

faWen.controller('ZwModalCtrl',
    function ($scope, $modalInstance, requestService, _) {
       /* // 区分新增与修改 1/2
        $scope.user = (user || {});
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

faWen.controller('EntityPanelCtrl',function($scope){
    $scope.selectSPD = function(){
        $scope.tab = {content: "templates/spd_detail.html"}
    }
    $scope.selectZW = function(){
        $scope.tab = {content: "templates/zw_detail.html"}
    }
})





