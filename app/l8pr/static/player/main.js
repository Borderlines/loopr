(function() {
    'use strict';

    angular.module('loopr.player', ['loopr.api', 'loopr.strip', 'loopr.login',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'ui.gravatar', 'FBAngular', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
            .state('home', {
                url: '/:username?show&item',
                controller: 'PlayerCtrl',
                templateUrl: '/static/player/player.html',
                controllerAs: 'vm'
            });
        }]);
})();
