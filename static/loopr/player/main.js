(function() {
    'use strict';

    angular.module('loopr.player', ['ngRoute', 'loopr.api', 'loopr.strip', 'LocalStorageModule',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'ui.gravatar', 'FBAngular'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
            .when('/:username', {
                controller: 'PlayerCtrl',
                templateUrl: '/static/loopr/player/player.html',
                controllerAs: 'vm',
                reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }]);
})();
