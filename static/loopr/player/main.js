(function() {
    'use strict';

    angular.module('loopr.player', ['ngRoute', 'loopr.api', 'loopr.strip', 'youtube-embed', 'cfp.hotkeys'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/:username', {
                    controller: 'PlayerCtrl',
                    templateUrl: '/static/loopr/player/partials/player.html',
                    controllerAs: 'vm',
                    reloadOnSearch:false
                });
            }
        ]);
})();
