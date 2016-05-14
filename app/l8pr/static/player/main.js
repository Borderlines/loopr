(function() {
    'use strict';

    angular.module('loopr.player', ['loopr.api', 'loopr.strip', 'loopr.login',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'ui.gravatar', 'FBAngular', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
            .state('index', {
                url: '/:username?show&item',
                controller: 'PlayerCtrl',
                templateUrl: '/static/player/player.html',
                controllerAs: 'vm',
                resolve: {
                    loopAuthor: function($stateParams, Accounts) {
                        return $stateParams.username;
                    }
                }
            })
            .state('index.loop', {
                url: '/loop',
                controller: 'LoopExplorerCtrl',
                templateUrl: '/static/strip/panels/loop.html',
                controllerAs: 'vm'
            })
            .state('index.show', {
                url: '/show/:showToExploreId',
                controller: 'ShowExplorerCtrl',
                templateUrl: '/static/strip/panels/show.html',
                controllerAs: 'vm',
                resolve: {
                    show: function($stateParams, Shows) {
                        return Shows.one($stateParams.showToExploreId).get();
                    }
                }
            });
        }]);
})();
