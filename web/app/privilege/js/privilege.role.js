privilege.controller("RoleManageCtrl",
    function ($scope, requestService, sliderService, $rootScope) {
      requestService.appRoleList().success(function (data) {
        $scope.appRoleList = data;
        initDefaultRole();
      })

      var initDefaultRole = function () {
        var appRoleList = $scope.appRoleList;
        for (var i = 0; i < appRoleList.length; i++) {
          var app = appRoleList[i],
              roleList = app["rolelist"],
              defaultRoleIdList = app["default_roleid_list"];
          for (var k = 0; k < defaultRoleIdList.length; k++) {
            var defalutRoleId = defaultRoleIdList[k];
            var role = _.find(roleList, function (role) {
              return role["roleid"] === defalutRoleId;
            });
            if(role) {
              role.isDefault = true;
            }
          }
        }
      }

      $scope.toggleRoleList = function (app) {
        $scope.selectedApp === app ? $scope.selectedApp = "" : $scope.selectedApp = app;
      }

      sliderService.initPath("voteRoleMenuList.json"); // 获取 投票成员角色 已经拥有的功能菜单
      $scope.mySliderToggle = function (role) {
        sliderService.setParams({roleid: role.roleid})
        if(!$scope.selectedRole) {
          $scope.selectedRole = role;
          sliderService.show()
        } else if($scope.selectedRole && $scope.selectedRole === role) {
          $scope.selectedRole = "";
          sliderService.hide()
        } else {
          $scope.selectedRole = role;
          sliderService.showAfterHide()
        }
      }

      $rootScope.$on("row.clearSelected", function () {
        $scope.selectedRole = "";
        $scope.$apply();
      })
      $rootScope.$on("entity.update", function (event, selectedMenuList) {
        $scope.selectedMenuList = selectedMenuList;
      })

      $scope.isSelectedRole = function (role) {
        return $scope.selectedRole === role ? "active gray" : "";
      }

      $scope.isSelectedApp = function (app) {
        if(!app) return;
        return $scope.selectedApp === app ? "js-app-item-selected highlight focus" : "";
      }
    })

privilege.controller('RoleModalCtrl',
    function ($scope, $modalInstance, requestService, _, selectedRole, oldRoleSelectedMenuList, $timeout) {
      $scope.role = (selectedRole || {});
      $scope.role.isNewRole = !$scope.role.roleid;
      // !!! distinct "add" and "new"
      if($scope.role.isNewRole) {
        $scope.modal = {title: "新增角色"};
      }
      // notice in ajax that will consume time
      requestService.menuList().success(function (menuList) {
        var menuTree;
        // treeData keeps stable otherwise the tree will be refactor
        $scope.treeData = wrapOpenedOption(wrapCheckedOption(menuList));
        $scope.treeConfig = {
          plugins: ["checkbox", "ui"],
          core: {
            strings: {'Loading ...': '玩命加载中！'},
            multiple: true, // mulit selection
            check_callback: true, // MUST
            'themes': {
              name: 'proton',
              url: '/assets/css/plugins/jstree/themes/proton/style.css',
              icons: false,
              dots: true,  // FIXME: wholerow 会影响 proton theme 的 dots 特征
              responsive: true
            }
          },
          checkbox: {
            three_state: true,
            tie_selection: false // MUST
          }
        }

        // the ready + CB name is bind in ngJsTree, which cannot be modified
        $scope.readyCB = function () {
          menuTree = $scope.treeInstance.jstree(true) // equivalent to $.jstree.core
          $scope.$apply(function () {
            adjustCheckedChildrenNode()
          })
        }

        /**
         * update menuList's state option on checked.
         * the checked rule is that nodes set checked=true if in oldRoleSelectedMenuList
         * @precondition：role isn't new
         * @param menuList
         * @returns menuList
         */
        function wrapCheckedOption(menuList) {
          if($scope.role.isNewRole) return menuList;
          var children;
          !$scope.role.isNewRole && _.each(oldRoleSelectedMenuList, function (selectedMenu) {
            _deal(selectedMenu)
          });
          return menuList;
          // inner method & depth recursion
          function _deal(selectedMenu) {
            _wrapIfFound(menuList, selectedMenu)
            if(selectedMenu.children && selectedMenu.children.length) {
              children = selectedMenu.children;
              _.each(children, function (selectedChildMenu) {
                _deal(selectedChildMenu)
              })
            }
          }

          function _wrapIfFound(menuList, selectedMenu) {
            _.each(menuList, function (menu) {
              _wrap(menu)
            });
            function _wrap(menu) {
              var children;
              if(menu.id === selectedMenu.id) {
                menu.state ? (menu.state.checked = true) : ( menu.state = {checked: true} )
                return;
              }
              if(menu.children && menu.children.length) {
                children = menu.children;
                _.each(children, function (childMenu) {
                  _wrap(childMenu)
                })
              }
            }
          }
        }

        /**
         * update menuList's state option on opened .
         * the opened rule is that nodes set opened=true if parent
         * @param menuList
         * @return menuList
         */
        function wrapOpenedOption(menuList) {
          var children;
          _.each(menuList, function (menu) {
            _deal(menu)
          });
          return menuList;
          function _deal(menu) {
            if(menu.children && menu.children.length) {
              menu.state ? (menu.state.opened = true) : ( menu.state = {opened: true} )
              children = menu.children;
              _.each(children, function (childMenu) {
                _deal(childMenu)
              })
            }
          }
        }

        // TODO: when a parent node be checked , It's children all be checked, so in here should be adjust correctly
        function adjustCheckedChildrenNode() {
          if($scope.role.isNewRole)  return;
          _.each($scope.treeData, function (menu) {
            _adjsutChecked(menu)
          });
          function _adjsutChecked(menu) {
            if(!menu.state || !menu.state.checked) {
              menuTree.uncheck_node(menu.id)
            }
            if(menu.children && menu.children.length) {
              _.each(menu.children, function (childMenu) {
                _adjsutChecked(childMenu)
              });
            }
          }
        }

        /**
         * use custom submit because it's more simple
         */
        $scope.submit = function () {
          $scope.role.menuIdList = menuTree.get_checked(); // TODO: parent unchecked if one child unchecked
          console.log($scope.role)
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      })
    })

privilege.directive("myRoleModal", ["$modal", "$document", "sliderService",
  function ($modal, $document, sliderService) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.click(function () {
          var modalInstance = $modal.open({
            backdrop: "static",
            keyboard: false,
            //size: "lg", // 如何自定义宽度，或修改脚本
            templateUrl: attr.template, // scope is in ModalInstanceCtrl
            controller: 'RoleModalCtrl'
            , resolve: {
              selectedRole: function () {
                return scope.selectedRole // 指令内部控制器，不能访问到外部 scope
              },
              oldRoleSelectedMenuList: function () {
                return scope.selectedMenuList
              }
            }
          })

          modalInstance.result.then(function () {
            sliderService.startAutoHide();
          }, function () {
            sliderService.startAutoHide();
          });

          modalInstance.opened.then(function () {
            sliderService.stopAutoHide();
          })
        })
      }
    }
  }])

