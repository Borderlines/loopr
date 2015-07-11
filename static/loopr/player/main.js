(function() {
    'use strict';

    angular.module('loopr.player', ['ngRoute', 'loopr.api', 'loopr.strip', 'youtube-embed'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/:username', {
                    controller: 'PlayerCtrl',
                    templateUrl: '/static/loopr/player/partials/player.html',
                    controllerAs: 'vm'
                })
                .when('/:username/:show', {
                    controller: 'PlayerCtrl',
                    templateUrl: '/static/loopr/player/partials/player.html',
                    controllerAs: 'vm'
                })
                .when('/:username/:show/:item', {
                    controller: 'PlayerCtrl',
                    templateUrl: '/static/loopr/player/partials/player.html',
                    controllerAs: 'vm'
                });
            }
        ]);
})();
