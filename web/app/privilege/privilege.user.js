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

    .controller('UserEditCtrl', ["$scope", "$modalInstance", "requestService", "user",
        function ($scope, $modalInstance, requestService, user) {
            requestService.userDetail(user.userno).success(function(data){
                $scope.user = data;
            })

            requestService.appList().success(function(data){
                $scope.appList = data;
                requestService.userRoleList(user.userno).success(function(data){
                    $scope.userRoleList = data;
                    $scope.userRoleListLoaded = true;
                })
            })

            $scope.showRoleList = function(app){
                if($scope.selected === app){
                    $scope.selected = "";
                    $scope.appRoleList = "";
                }else{
                    $scope.selected = app;
                    $scope.appRoleList = app.roleList;
                }
            }

            $scope.isSelected = function(app){
                return $scope.selected === app ? "js-app-item-selected highlight" : "";
            }

            $scope.isChecked = function(){
                return true;
            }

            $scope.ok = function () {
                $modalInstance.close();
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
                            ,resolve: {
                                user: function () {
                                    return {"userno": scope.userno} ;
                                }
                            }
                        })

                        modalInstance.result.then(function () {
                            entityService.startAutoHide();

                        }, function () {
                            //$document.bind("mousedown", scope,)
                            //console.log($document)
                            //event && event["mousedown"] && console.log(event["mousedown"])
                            //console.log($document.attr("mousedown"))
                            console.log('Modal dismissed at: ' + new Date());
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