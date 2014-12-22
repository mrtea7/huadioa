angular.module('underscore', [])
    .factory('_', function () {
        return window._;
    });

angular.module('privilegeModule', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce', 'underscore'])

    .config(function ($stateProvider, $urlRouterProvider) {
        // $urlRouterProvider.otherwise('/userManage'); // 此处无须设置默认值，因为要动态确认的
        // 可动态初始化功能节点
        $stateProvider
            .state('userManage', {
                url: '/userManage',
                views: {
                    'content': {
                        templateUrl: 'templates/userManage.html'
                    }
                }
            })
            .state('deptManage', {
                url: '/deptManage',
                views: {
                    'content': {
                        templateUrl: 'templates/deptManage.html'
                    }
                }
            })
            .state('roleManage', {
                url: '/roleManage',
                views: {
                    'content': {
                        templateUrl: 'templates/roleManage.html'
                    }
                }
            })
    })

    /*
     * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
     */
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            //$rootScope.BACKEND_SERVER = "http://192.168.2.115:8080/data/module/privilege/"
            $rootScope.BACKEND_SERVER = "data/"
        }])

    .factory('appService', ['$http', '$rootScope', function ($http, $rootScope) {
        var BACKEND_SERVER = $rootScope.BACKEND_SERVER;

        var doRequest = function (username, url) {
            //return $http.jsonp(url)
            return $http({
                method: 'GET',
                url: url
            });
        };
        return {
            menuList: function (placeholder) {
                return doRequest(placeholder, BACKEND_SERVER + 'privilegeMenu.json?callback=JSON_CALLBACK');
            }
        };
    }])

    .factory('userService', ['$http', "$rootScope", function ($http, $rootScope) {
        var BACKEND_SERVER = $rootScope.BACKEND_SERVER;
        var doRequest = function (username, url) {
            //return $http.jsonp(url) // 解决跨域问题
            return $http({
                method: 'GET',
                url: url
            });
        };
        return {
            userList: function (userno) {
                return doRequest(userno, BACKEND_SERVER + 'userList.json?callback=JSON_CALLBACK');
            }
            , user: function (userno) {
                return doRequest(userno, BACKEND_SERVER + 'userDetail_' + userno + '.json?callback=JSON_CALLBACK');
            }
        };
    }])

    .factory('entityService', ['$http', '$rootScope', '$parse', 'userService', '$document',
        function ($http, $rootScope, $parse, userService, $document) {
            var $entity = $("#entity-panel"),
                selectedAccessor = $parse("selected"),
                userAccessor = $parse("$parent.$parent.user"),
                userScope,
                show = function (user) {
                    userService.user(user.userno).success(function (data, httpStatus) {
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

    .controller("MainCtrl", ["$scope", "$modal", "userService",
        function ($scope, $modal, userService) {

        }])

    .controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "user",
        function ($scope, $modalInstance, user) {
            $scope.user = user.data;
            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }])

    .controller('SidebarCtrl', ['$scope', '$rootScope', '$state', 'appService',
        function ($scope, $rootScope, $state, appService) {
            appService.menuList().success(function (data, httpStatus) {
                $scope.menu = data; // 注：原来叫 content 会覆盖掉对象原有的属性
                $state.transitionTo(data[0].menucode);
                $scope.selected = data[0];
            })
            $scope.setPage = function (menu) {
                $state.transitionTo(menu.menucode);
                $scope.selected = menu;
            };
            $scope.isSelected = function (menu) {
                //console.log(" isSelected")
                return $scope.selected === menu ? 'open' : '';
            };
        }])

    .controller("ListCtrl", ["$scope", 'userService', 'entityService', '$timeout',
        function ($scope, userService, entityService, $timeout) {
            userService.userList().success(function (data, httpStatus) {
                $timeout(function () {
                    $scope.userList = data;
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

    .controller("UerRoleCtrl", ["$scope",
        function ($scope) {

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

    .directive("myBtnRefulsh", [function () {
        return {
            restrict: 'E',
            replace: true, // 用 template 替换指令
            template: ['<button type="button" data-toggle="refresh" class="btn btn-sm btn-default" title="刷新">',
                '<i class="fa fa-refresh"></i>',
                '</button>'].join(""),
            link: function (scope, element, attr) {
                element.click(function () {
                    window.location.reload()
                })
            }
        }
    }])

    .directive("myUserModal", ["$modal", "userService", "$document", "entityService",
        function ($modal, userService, $document, entityService) {
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
                            controller: 'ModalInstanceCtrl'
                            ,
                            resolve: {
                                user: function () {
                                    var promise = userService.user(scope.userno);
                                    promise.success(function (data, httpStatus) {
                                        return {
                                            data: data
                                        };
                                    })
                                    return promise;
                                }
                            }
                        })

                        modalInstance.result.then(function (selectedItem) {
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
