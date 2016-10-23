(function() {
'use strict';

LoopExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'loopToExplore',
'latestItemsShow', '$state'];
function LoopExplorerCtrl(Player, scope, stripService, loopToExplore,
latestItemsShow, $state) {
    var vm = this;
    function reorderShows() {
        var shows;
        var indexOfCurrentShow = _.findIndex(loopToExplore.shows_list, function(s) {return s === Player.currentShow;});
        if (indexOfCurrentShow > -1) {
            var reordered = loopToExplore.shows_list.slice(indexOfCurrentShow, loopToExplore.shows_list.length);
            shows = reordered.concat(loopToExplore.shows_list.slice(0, indexOfCurrentShow));
        } else {
            shows = loopToExplore.shows_list;
        }
        // load latest item and add it to a new show
        if (!_.any(shows, function isALatestShow(s) {
            return s.show_type === 'last_item';
        })) {
            shows.unshift(latestItemsShow);
        }
        vm.shows = shows;
    }
    angular.extend(vm, {
        Player: Player,
        play: function(show) {
            if (loopToExplore.id !== Player.loop.id) {
                Player.playLoop(loopToExplore, show.id);
            } else {
                Player.playShow(show);
            }
        },
        stripService: stripService
    });
    reorderShows();
    scope.$on('l8pr.updatedLoop', function(e, updatedLoop) {
        if (!updatedLoop || updatedLoop.id === loopToExplore.id) {
            $state.reload('root.app.open');
        }
    });
}

angular.module('loopr.strip')
.controller('LoopExplorerCtrl', LoopExplorerCtrl)
.directive('horizontalScroll', [function() {
    return {
        link: function(scope, element) {
            element.mousewheel(function(event, delta) {
                if (event.deltaY !== 0 && Math.abs(event.deltaY) === 1) {
                    this.scrollLeft -= (event.deltaY * event.deltaFactor);
                    event.preventDefault();
                }
            });
        }
    };
}])
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
                    if(scope.swapOnHover && scope.swapOnHover.length > 0) {
                        return scope.swapOnHover[index % scope.swapOnHover.length].thumbnail;
                    }
                };
                var exit;
                var enter = false;
                scope.index = 0;
                function loadNew() {
                    $timeout.cancel(exit);
                    scope.index++;
                    exit = $timeout(loadNew, 2000);
                }
                var debounced = _.debounce(loadNew, 500, {leading: true, trailing: false});
                element.on('mouseenter', function() {
                    if (!enter) {
                        debounced();
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
