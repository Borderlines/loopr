(function() {
    'use strict';
    angular.module('loopr.strip')
    .directive('l8prExploreLoop', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/strip/panels/loop.html',
            controllerAs: 'vm',
            controller: ['Player', function(Player) {
                var vm = this;
                angular.extend(vm, {
                    Player: Player
                });
            }]
        };
    })
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
