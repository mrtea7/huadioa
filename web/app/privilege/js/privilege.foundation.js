var privilege = angular.module('myApp.privilege', [
    'ui.router',
    'ui.bootstrap',
    'pasvaz.bindonce',
    'underscore',
    'ngAnimate',
    "handyUtilities",
    "request",
    "slider"
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/userManage'); // 容错处理
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
            console.clear();
        }])

    .controller('PrivilegeCtrl', ['$scope', '$rootScope', '$state', 'requestService',
        function ($scope, $rootScope, $state, requestService) {

        }])

    .controller('SidebarCtrl', ['$scope', '$rootScope', '$state', 'requestService',
        function ($scope, $rootScope, $state, requestService) {
            requestService.privilegeMenuList().success(function (data, httpStatus) {
                $scope.menu = data; // 注：content 属性是保留字
                $state.transitionTo(data[0]['menucode']);
                $scope.selected = data[0];
            })
            $scope.setPage = function (menu) {
                $state.transitionTo(menu['menucode']);
                $scope.selected = menu;
            };
            $scope.isSelected = function (menu) {
                return $scope.selected === menu ? 'open' : '';
            };
        }])




