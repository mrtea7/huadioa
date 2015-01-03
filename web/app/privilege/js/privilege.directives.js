/*
privilege.directive("myEntityPanel", ["requestService",
    function (requestService) {
        return {
            restrict: 'A',
            templateUrl: 'entityContent.html',
            link: function (scope, element, attr) {
                scope.$on("entityPanel.show", function (event, args) {
                    requestService.doGetRequest(args.path).success(function (data, httpStatus) {
                        element.animate({right: "0"}, "fast");
                    })
                })
                scope.$on("entityPanel.hide", function (event, args) {
                    element.animate({right: "-35%"}, "fast");
                })
            }
        }
    }])
*/

privilege.directive("myBtnRefulsh", [function () {
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