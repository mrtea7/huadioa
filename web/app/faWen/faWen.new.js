faWen.controller("NiGaoCtrl",
    function ($scope, $timeout, $state, $stateParams, $rootScope, sliderService, requestService, $document) {
        $scope.test = function(){
            //console.log("eset")
        }
        
        requestService.faWenList().success(function (data, httpStatus) {
            $timeout(function () {
                $scope.itemList = data;
            }, 0)
        });

        sliderService.initPath("faWen.itemDetail.json"); // be mock
        $scope.mySliderToggle = function (item) {
            sliderService.setParams({flowinstid: item.flowinstid})
            if (!$scope.selected) {
                $scope.selected = item;
                sliderService.show()
            } else if ($scope.selected && $scope.selected === item) {
                $scope.selected = "";
                sliderService.hide()
            } else {
                $scope.selected = item;
                sliderService.showAfterHide()
            }
        }

        $rootScope.$on("row.clearSelected", function () {
            $scope.selected = "";
            $scope.$apply();
        })
        $rootScope.$on("entity.update", function (event, item) {
            $scope.item = item;
        })

        $scope.isSelected = function (item) {
            return $scope.selected === item ? "active" : "";
        }

        $scope.selectAllItem = function () {
            var bool = $scope.selectAllCheckbox.isChecked;
            _.each($scope.itemList, function (item) {
                item.selected = bool
            });
        }

        $scope.selectItem = function ($event) {
            $event.stopPropagation();
        }

        $scope.batchIsActived = function () {
            var found = _.find($scope.itemList, function (item) {
                return item.selected === true
            });
            return found;
        }

        $scope.deleteItems = function () {
            var selectedItems = _.filter($scope.itemList, function (item) {
                return item.selected === true
            });
            console.log(selectedItems)
        }
    })
