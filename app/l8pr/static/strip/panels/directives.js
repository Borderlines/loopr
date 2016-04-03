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
    .directive('infinitScroll', ['$timeout', function($timeout) {
        return {
            scope: {},
            transclude: true,
            template: ['<div class="infinit-scroll__wrapper">',
            '<div class="infinit-scroll__item" ng-transclude></div>',
            '<div class="infinit-scroll__item" ng-transclude ng-if="enabled"></div>',
            '</div>'].join(''),
            link: function(scope, element) {
                $timeout(function() {
                    scope.enabled = element.find('.infinit-scroll__item').width() > element.width();
                });
                scope.$on('$destroy', function() {
                    element.unbind('scroll');
                });
                scope.$watch('enable', function(enable) {
                    $timeout(function() {
                        if (scope.enabled) {
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
    }])
    .directive('l8prExploreLoop', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: '/static/strip/panels/loop.html',
            controllerAs: 'vm',
            controller: LoopExplorerCtrl,
            link: function(scope, element, attr, vm) {
                function resizeCurrentShow() {
                    var heights = element.find('.show').map(function() {
                        return $(this).innerHeight();
                    });
                    var maxHeight = Math.max.apply(null, heights);
                    // set the heigh for the current show
                    element.find('.show').css({height: ''});
                    element.find('.show--current-show').css({height: maxHeight});
                }
                function resizeWidth() {
                    var scale = [150, 350];
                    var widths = vm.shows.map(function(show) {
                        return show.duration();
                    });
                    var maxWidth = Math.max.apply(null, widths);
                    var minWidth = Math.min.apply(null, widths);
                    // set the width depending of the duration
                    scope.getWidth = function(show) {
                        return (scale[1] - scale[0]) * (show.duration() / (maxWidth - minWidth)) + scale[0];
                    };
                }
                function resizeAll() {
                    $timeout(function() {
                        resizeWidth();
                        resizeCurrentShow();
                        element.find('.loop__shows').scrollLeft(0);
                    });
                }
                resizeAll();
                scope.$watch(function() {
                    return vm.shows;
                }, resizeAll);
                angular.element($window).on('resize', resizeCurrentShow);
            }
        };
    }])
    .directive('l8prShare', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/strip/panels/share.html',
            controllerAs: 'vm',
            controller: ['Player', '$location', function(Player, $location) {
                var vm = this;
                angular.extend(vm, {
                    Player: Player,
                    link: $location.absUrl(),
                    copyToClipboard: function(text) {
                        window.prompt('Copy to clipboard: Ctrl+C, Enter', text);
                    }
                });
            }]
        };
    });
})();
