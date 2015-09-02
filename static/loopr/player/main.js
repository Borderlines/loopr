(function() {
    'use strict';

    angular.module('loopr.player', ['ngRoute', 'loopr.api', 'loopr.strip', 'cfp.hotkeys', 'loopr.player.youtube'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
            .when('/:username', {
                controller: 'PlayerCtrl',
                templateUrl: '/static/loopr/player/partials/player.html',
                controllerAs: 'vm',
                reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }]);
})();
