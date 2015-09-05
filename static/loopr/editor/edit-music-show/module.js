(function() {
    'use strict';

    EditMusicShowCtrl.$inject = ['$controller', '$scope', 'Shows', 'embedService',
                                 '$location', '$routeParams', '$route', '$rootScope', '$q'];
    function EditMusicShowCtrl($controller, $scope, Shows, embedService,
                               $location, $routeParams, $route, $rootScope, $q) {
        var vm = $controller('EditShowCtrl as vm', {'$scope': $scope});
        angular.extend(vm, {
            example: 'https://soundcloud.com/xxx/yyy',
            options: [
                {
                    type: 'checkbox',
                    label: 'Giphy',
                    name: 'giphy',
                    defaultValue: true
                },
                {
                    dependsOn: {giphy: true},
                    type: 'text',
                    label: 'Giphy Tags',
                    name: 'giphyTags'
                },
                {
                    dependsOn: {giphy: true},
                    type: 'checkbox',
                    label: 'DjLayout',
                    name: 'djLayout'
                }
            ]
        });
        // create a new item and redirect to it
        if (!angular.isDefined($routeParams.showId)) {
            return vm.createShow({type: 'MusicShow', title: 'A Music Show', settings: {giphyTags: 'dance,dancing,abstract'}}, true);
        }
        // load the shows
        vm.loadShow();
    }

    angular.module('loopr').controller('EditMusicShowCtrl', EditMusicShowCtrl);

})();
