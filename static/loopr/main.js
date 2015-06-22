(function() {
    'use strict';

    angular.module('loopr', ['ngRoute'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                when('/createShow', {
                    templateUrl: 'static/loopr/partials/create-youtube-show.html',
                    controller: 'CreateYoutubeShowCtrl',
                    controllerAs: 'vm'
                }).
                otherwise({
                    redirectTo: '/'
                });
            }
        ]);
})();