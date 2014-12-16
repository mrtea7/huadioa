angular.module('underscore', [])
    .factory('_', function () {
        return window._;
    });

angular.module('privilegeModule', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce', 'underscore'])

/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 */
    .run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    })

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 */
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
        $stateProvider
            .state('main', {
                url: '/main',
                views: {
                    'sidebar': {
                        templateUrl: 'sidebar.html'
                    }
                }
            })
    })

    .factory('userService', ['$http', function ($http) {
        var doRequest = function (username, filename) {
            return $http({
                method: 'GET',
                url: filename
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
                $rootScope.$broadcast('entity.show');
            },
            hide: function (callback) {
                $rootScope.$broadcast('entity.hide', callback);
            }
        }
        return service;
    }])

    .controller("MainController", ["$scope", "$modal", "$rootScope",
        function ($scope, $modal, $rootScope) {
            $scope.editUser = function () {
                $modal.open({
                    templateUrl: "userEdit.html"
                })
            }
        }])

    .controller("ListController", ["$scope", "$rootScope", 'userService', '_', 'entityService',
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
        }
    ])


    .directive("myUserQuickEntity", function () {
        return {
            restrict: 'A',
            templateUrl: 'userEntity.html',
            controller: ['$scope', function ($scope) {
                var $entity = $("#entity-panel");
                $scope.$on('entity.show', function () {
                    $entity.animate({right: "0"}, "fast");
                })
                $scope.$on('entity.hide', function (event, callback) {
                    $entity.animate({right: "-35%"}, "fast", callback);
                });
            }],
            link: function ($scope, element) {
                // 私有
            }
        }
    })
