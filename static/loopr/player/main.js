(function() {
    'use strict';

    angular.module('loopr.player', ['ngRoute', 'loopr.api', 'loopr.strip', 'youtube-embed', 'cfp.hotkeys'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
            .when('/loop/:username', {
                controller: 'PlayerCtrl',
                templateUrl: '/static/loopr/player/partials/player.html',
                controllerAs: 'vm',
                reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }]);
})();
