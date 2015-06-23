(function() {
    'use strict';

    CreateYoutubeShowCtrl.$inject = ['api', 'embedService'];
    function CreateYoutubeShowCtrl(api, embedService) {
        var vm = this;
        angular.extend(vm, {
            links: [],
            add: function(link) {
                embedService.get(link).then(function(data) {
                    vm.links.push({
                        url: data.url,
                        thumbnail: data.thumbnail_url,
                        author_name: data.author_name,
                        title: data.title,
                        provider_name: data.provider_name
                    });

                });
            }
        });
    }

    angular.module('loopr', ['ngRoute', 'loopr.api', 'angular-embed'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                when('/createShow', {
                    templateUrl: 'static/loopr/partials/create-youtube-show.html',
                    controller: CreateYoutubeShowCtrl,
                    controllerAs: 'vm'
                }).
                otherwise({
                    redirectTo: '/'
                });
            }
        ]);

})();