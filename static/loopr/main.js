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
        ])
        .filter('seconds', function() {
            return function(time) {
                var hours = Math.floor(time / 3600);
                time = time - hours * 3600;
                var minutes = Math.floor(time / 60);
                var seconds = time - minutes * 60;
                var time_str = ''
                if (hours > 0) {
                    time_str += hours + 'h';
                }
                return time_str + minutes + 'm' + seconds + 's';
            }
        });

})();
