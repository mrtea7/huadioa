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