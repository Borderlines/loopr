(function() {
    'use strict';

    LoopExplorerCtrl.$inject = ['Player'];
    function LoopExplorerCtrl(Player) {
        var vm = this;
        angular.extend(vm, {
            player: Player,
            shows: Player.loop.shows_list
        });
    }

    angular.module('loopr.strip')
    .directive('l8prExploreLoop', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: '/static/strip/panels/loop.html',
            controllerAs: 'vm',
            controller: LoopExplorerCtrl,
            link: function(scope, element, attr, vm) {
                function resize() {
                    var heights = element.find('.show').map(function() {
                        return $(this).innerHeight();
                    });
                    var maxHeight = Math.max.apply(null, heights);
                    element.find('.show--current-show').css({
                        height: maxHeight
                    });
                }
                $timeout(resize, 500);
                angular.element($window).on('resize', resize);
                scope.$watch(function() {
                    return vm.shows;
                }, resize);
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
