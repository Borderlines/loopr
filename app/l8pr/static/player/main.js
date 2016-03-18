(function() {
    'use strict';

    angular.module('loopr.player', ['ngRoute', 'loopr.api', 'loopr.strip', 'loopr.login',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'ui.gravatar', 'FBAngular'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
            .when('/', {
                controller: 'PlayerCtrl',
                templateUrl: '/static/player/player.html',
                controllerAs: 'vm',
                reloadOnSearch:false
            })
            .when('/:username', {
                controller: 'PlayerCtrl',
                templateUrl: '/static/player/player.html',
                controllerAs: 'vm',
                reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }]);
})();
