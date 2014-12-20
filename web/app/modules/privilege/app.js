angular.module('underscore', [])
    .factory('_', function () {
        return window._;
    });

angular.module('privilegeModule', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce', 'underscore'])

    .config(function ($stateProvider, $urlRouterProvider) {
        // 作用：如果是初始化的，那么是动态的
        //$urlRouterProvider.otherwise('/userManage');
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
        }])

    .factory('appService', ['$http', function ($http) {
        var doRequest = function (username, filename) {
            return $http({
                method: 'GET',
                url: 'data/' + filename
            });
        };
        return {
            menuList: function (placeholder) {
                return doRequest(placeholder, 'privilegeMenu.json');
            }
        };
    }])

    .factory('userService', ['$http', function ($http) {
        var doRequest = function (username, filename) {
            return $http({
                method: 'GET',
                url: 'data/' + filename
            });
        };
        return {
            userList: function (userno) {
                return doRequest(userno, 'userList.json');
            }
            , user: function (userno) {
                return doRequest(userno, 'userDetail_' + userno + '.json');
            }
        };
    }])

    .factory('entityService', ['$http', '$rootScope', '$parse', 'userService', '$document',
        function ($http, $rootScope, $parse, userService, $document) {
            var $entity = $("#entity-panel"),
                selectedAccessor = $parse("selected"),
                userAccessor = $parse("$parent.$parent.user")
                ;
            var hide = function (scope) {
                userAccessor.assign(scope, "")
                selectedAccessor.assign(scope, "")
                $entity.animate({right: "-35%"}, "fast");
                if (scope.$root && scope.$root.$$phase != '$apply'
                    && scope.$root.$$phase != '$digest') { // angular hack
                    scope.$apply(); // for document hide
                }
            }
            return {
                show: function (scope, user) {
                    userService.user(user.userno).success(function (data, httpStatus) {
                        selectedAccessor.assign(scope, user)
                        userAccessor.assign(scope, data)
                        $entity.animate({right: "0"}, "fast");
                    })
                },
                hide: hide,
                autoHide: function (scope) {
                    $document.mousedown(scope, function (event) {
                        var $target = $(event.target);
                        if (!($target.parents("#entity-panel").length > 0
                            || $target.parents("#userList").length > 0)) {
                            hide(scope)
                        }
                    })
                }
            };
        }])

    .controller("MainCtrl", ["$scope", "$modal",
        function ($scope, $modal) {
            $scope.editUser = function () {
                $modal.open({
                    templateUrl: "templates/userEdit.html",
                    backdrop: "static",
                    size: "lg"
                })
            }
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

    .controller("ListCtrl", ["$scope", 'userService', 'entityService',
        function ($scope, userService, entityService) {
            userService.userList().success(function (data, httpStatus) {
                $scope.userList = data;
            });
            $scope.selected = "";
            $scope.toggle = function (user, $event) {
                if (!$scope.selected) {
                    entityService.show($scope, user);
                } else if ($scope.selected && $scope.selected === user) {
                    entityService.hide($scope);
                } else {
                    entityService.hide($scope);
                    entityService.show($scope, user);
                }
                $event.stopPropagation();
            }
            entityService.autoHide($scope)
            $scope.isSelected = function (user) {
                // 自执行，传递 user，与 selected 比较
                //console.log("isSelectedFn")
                return $scope.selected === user ? "js_entity_selected active" : "";
            }
        }])

    .directive("myUserEntity", ["$document", function ($document) {
        return {
            restrict: 'A',
            templateUrl: 'templates/userEntity.html'
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







