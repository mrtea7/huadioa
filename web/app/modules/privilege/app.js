angular.module('underscore', [])
    .factory('_', function () {
        return window._;
    });

angular.module('privilegeModule', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce', 'underscore'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/userManage');
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
    .run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    })

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
                $rootScope.$broadcast('entity.show');
            },
            hide: function (callback) {
                $rootScope.$broadcast('entity.hide', callback);
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

    .controller('SidebarCtrl', ['$scope', '$state', 'appService',
        function ($scope, $state, appService) {
            appService.menuList().success(function (data, httpStatus) {
                $scope.content = data;
            })

            $scope.setPage = function (page) {
                $state.transitionTo(page);
                $scope.selected = page;
            };
            $scope.selected = "";
            $scope.isSelected = function (page) {
                //console.log("SidebarCtrl isSelected")
                return $scope.selected === page ? 'open' : '';
            };
            //console.log("SidebarCtrl " )
            //console.log( $scope)

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
                //console.log("ListController isSelected")
                return $scope.selected === user ? "js_entity_selected active" : "";
            }
            //console.log("ListController " )
            //console.log( $scope)
        }])


    .directive("myUserQuickEntity", function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/userEntity.html',
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
