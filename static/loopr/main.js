(function() {
    'use strict';

    angular.module('loopr', ['ngRoute', 'loopr.api', 'angular-embed'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/shows', {
                    controller: 'ShowsCtrl',
                    templateUrl: 'static/loopr/partials/shows-list.html',
                    controllerAs: 'vm'
                })
                .when('/show/:showId?', {
                    templateUrl: 'static/loopr/partials/edit-youtube-show.html',
                    controller: 'EditVideoShowCtrl',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/shows'
                });
            }
        ]);

})();