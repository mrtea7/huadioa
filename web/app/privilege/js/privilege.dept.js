privilege.controller("DeptManageCtrl", function ($scope, requestService, ngToast) {
    requestService.deptList().success(function (data) {
        $scope.treeData = data;
        $scope.treeConfig = {
            core: {
                strings : {'Loading ...' : '拼命加载中！'},
                multiple : false,
                check_callback: true,
                themes: {
                    name: false,
                    url: false,
                    dir: false,
                    icons: true,
                    variant: false,
                    stripes: false,
                    responsive: true,
                    dots: true
                }
            },
            contextmenu: {
                "select_node": true,
                "items": customMenu
            },
            types: {"default": {icon: "icon icon_folder_blue"}},
            plugins: ["types", "contextmenu", "wholerow"]
        }
    })

    function customMenu() {

        var items = $.jstree.defaults.contextmenu.items();
        items.create.label = "添加子部门"
        items.create.action = function (obj) {
            var instance = $.jstree.reference(obj.reference),
                node = instance.get_node(obj.reference);
            instance.create_node(node, {type: "default", text: "新建部门"}, "last", function (node) {
                setTimeout(function () {
                    instance.edit(node)
                }, 0)
            })
        }
        items.rename.label = "重命名"
        items.remove.label = "删除"
        items.remove.action = function (a) {
            var instance = $.jstree.reference(a.reference),
                node = instance.get_node(a.reference);
            //confirm("<p>确定删除 {0} ?</p><p>没有子部门且没有成员的部门才可以被删除。</p>".format(node.text)
        }
        delete items.ccp;
        return items
    }
})
