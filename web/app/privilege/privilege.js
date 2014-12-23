angular.module('underscore', [])
    .factory('_', function () {
        return window._;
    });

var privilege = angular.module('myApp.privilege', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce', 'underscore'])

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
            $rootScope.BACKEND_SERVER = "json/"
        }])

    .factory('requestService', ['$http', '$rootScope', function ($http, $rootScope) {
        var BACKEND_SERVER = $rootScope.BACKEND_SERVER;
        var doGetRequest = function (url) {
            //return $http.jsonp(url)  // 解决跨域问题
            return $http({
                method: 'GET',
                url: url
            });
        };
        //var doPostRequest = function () {
        //
        //};
        return {
            menuList: function () {
                return doGetRequest(BACKEND_SERVER + 'privilegeMenu.json?callback=JSON_CALLBACK');
            },
            userList: function () {
                return doGetRequest(BACKEND_SERVER + 'userList.json?callback=JSON_CALLBACK');
            },
            userDetail: function (userno) {
                return doGetRequest(BACKEND_SERVER + 'userDetail_' + userno + '.json?callback=JSON_CALLBACK');
            }
        };
    }])

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



    .controller('SidebarCtrl', ['$scope', '$rootScope', '$state', 'requestService',
        function ($scope, $rootScope, $state, requestService) {
            requestService.menuList().success(function (data, httpStatus) {
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
                            /*,
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
                            }*/
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
