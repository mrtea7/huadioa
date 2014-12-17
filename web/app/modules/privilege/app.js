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
/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 */
    .run(['$rootScope', '$state', '$stateParams', 'appService',
        function ($rootScope, $state, $stateParams, appService) {
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

    .factory('entityService', ['$http', '$rootScope', function ($http, $rootScope) {
        var service = {
            show: function () {
                $rootScope.$emit('entity.show');
            },
            hide: function (callback) {
                $rootScope.$emit('entity.hide', callback);
            }
        }
        return service;
    }])

    .controller("MainCtrl", ["$scope", "$modal",
        function ($scope, $modal) {
            $scope.editUser = function () {
                $modal.open({
                    templateUrl: "templates/userEdit.html"
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
                return $scope.selected === menu ? 'open' : '';
            };
        }])

    .controller("ListCtrl", ["$scope", "$rootScope", 'userService', '_', 'entityService',
        function ($scope, $rootScope, userService, _, entityService) {
            userService.userList().success(function (data, httpStatus) {
                $scope.userList = data;
            });
            $scope.selected = "";
            $scope.toggleClick = function (user) {
                entityService.hide(function () {
                    if ($scope.selected === user) {
                        $scope.selected = "";
                        $scope.$parent.user = "";
                    } else {
                        userService.user(user.userno).success(function (data, httpStatus) {
                            $scope.$parent.user = data;
                            $scope.selected = user;
                            entityService.show();
                        })
                    }
                });
            }
            // 何时调用
            $scope.isSelected = function (user) {
                return $scope.selected === user ? "js_entity_selected active" : "";
            }
        }])


    .directive("myUserQuickEntity", function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/userEntity.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                var $entity = $("#entity-panel");
                $rootScope.$on('entity.show', function () {
                    $entity.animate({right: "0"}, "fast");
                })
                $rootScope.$on('entity.hide', function (event, callback) {
                    $entity.animate({right: "-35%"}, "fast", callback);
                });
            }],
            link: function ($scope, element) {
                // 私有
            }
        }
    })
