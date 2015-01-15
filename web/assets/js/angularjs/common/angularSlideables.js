angular.module('angularSlideables', [])
    .directive('slideToggle', function () {
      return {
        restrict: 'A',
        scope: {
          slideExpanded: "=" // 对外暴露状态
        },
        link: function (scope, element, attrs) {
          var selector = attrs.slideToggle, target;
          if(!selector) {
            target = element.parent().find("[slideable]"); // 默认值
            if(!target.length) {
              console.error("target not found !");
              return false;
            }
          } else {
            target = $(selector)
          }
          target = target[0]; // turn to dom
          var content = target.querySelector('.slideable_content');
          element.bind('click', function () {
            // 注： var expanded = scope.slideExpanded， 此种对 expanded 的操作，不会对 scope.slideExpanded 有影响
            if(!scope.slideExpanded) {
              content.style.border = '1px solid rgba(0,0,0,0)';
              var y = content.clientHeight;
              //console.log("y",y)
              content.style.border = 0;
              target.style.height = y + 'px';
            } else {
              target.style.height = '0px';
            }
            scope.slideExpanded = !scope.slideExpanded;
          });
        }
      }
    })
    .directive('slideable', function () {
      return {
        restrict: 'A',
        scope: {
          initSlideOpened: "=" // 对外暴露状态
        },
        compile: function (element, attr) {
          var contents = element.html(); // 注：获取元素内部的 html，而非本身的
          element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');
          return function postLink(scope, element, attrs) {
            var obj;
            // default properties （可以在元素标签上直接设置，或者用默认值）
            attrs.duration = (!attrs.duration) ? '0.3s' : attrs.duration;
            attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
            obj = {
              'overflow': 'hidden',
              'height': '0px',
              'transitionProperty': 'height',
              'transitionDuration': attrs.duration,
              'transitionTimingFunction': attrs.easing
            }
            //console.log(element.find(".slideable_content").height())
            //console.log(element.height())
            scope.initSlideOpened ? obj.height= attrs.height : '';
            element.css( obj );
          };
        }
      };
    })

