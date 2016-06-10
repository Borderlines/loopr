(function() {
'use strict';

LoopExplorerCtrl.$inject = ['Player', '$scope', 'strip'];
function LoopExplorerCtrl(Player, scope, stripService) {
    var vm = this;
    function reorderShows() {
        var indexOfCurrentShow = _.findIndex(Player.loop.shows_list, function(s) {return s === Player.currentShow;});
        var reordered = Player.loop.shows_list.slice(indexOfCurrentShow, Player.loop.shows_list.length);
        vm.shows = reordered.concat(Player.loop.shows_list.slice(0, indexOfCurrentShow));
    }
    angular.extend(vm, {
        player: Player,
        stripService: stripService
    });
    scope.$watch(function() {
        return Player.currentShow;
    }, reorderShows);
}

angular.module('loopr.strip')
.controller('LoopExplorerCtrl', LoopExplorerCtrl)
.directive('swapOnHover', ['$timeout', function($timeout) {
    return {
        template: [
            '<div class="swap-animation" ng-animate-swap="index"',
            '     ng-style="{\'background-image\': \'url(\' + getBg(index) + \')\'}">',
            '</div>'
        ].join(''),
        scope: {
            swapOnHover: '='
        },
        link: function(scope, element, attr) {
            $timeout(function() {
                scope.getBg = function(index) {
                    return scope.swapOnHover[index % scope.swapOnHover.length].thumbnail;
                };
                var exit;
                var enter = false;
                scope.index = 0;
                function loadNew() {
                    scope.index++;
                    $timeout.cancel(exit);
                    exit = $timeout(loadNew, 1500);
                }
                element.on('mouseenter', function() {
                    if (!enter) {
                        loadNew();
                    }
                    enter = true;
                });
                    element.on('mouseleave', function() {
                    enter = false;
                    $timeout.cancel(exit);
                });
            });
        }
    };
}])
.directive('infinitScroll', ['$timeout', function($timeout) {
    return {
        transclude: true,
        template: ['<div class="infinit-scroll__wrapper">',
        '<div class="infinit-scroll__item" ng-transclude></div>',
        '<div class="infinit-scroll__item" ng-transclude ng-if="infinitScrollEnable"></div>',
        '</div>'].join(''),
        link: function(scope, element) {
            $timeout(function() {
                scope.infinitScrollEnable = element.find('.infinit-scroll__item').width() > element.width();
            });
            scope.$on('$destroy', function() {
                element.unbind('scroll');
            });
            scope.$watch('infinitScrollEnable', function(infinitScrollEnable) {
                $timeout(function() {
                    if (scope.infinitScrollEnable) {
                        var items = element.find('.infinit-scroll__item');
                        element.scrollLeft(items[1].offsetLeft);
                        element.scroll(function(a,b) {
                            if (element.scrollLeft() >= items.width() * 2 - element.width()) {
                                element.scrollLeft(items[1].offsetLeft - element.width());
                            }
                            if (element.scrollLeft() === 0) {
                                element.scrollLeft(items.width());
                            }
                        });
                    } else {
                        element.unbind('scroll');
                    }
                });
            });
        }
    };
}]);

})();
