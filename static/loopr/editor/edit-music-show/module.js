(function() {
    'use strict';

    EditMusicShowCtrl.$inject = ['$controller', '$scope',
                                 '$routeParams', '$rootScope', '$q'];
    function EditMusicShowCtrl($controller, $scope,
                               $routeParams, $rootScope, $q) {
        var vm = $controller('EditShowCtrl as vm', {'$scope': $scope});
        angular.extend(vm, {
            example: 'Paste a Youtube or Soundcloud link here, to add content to this show',
            options: [
                {
                    type: 'checkbox',
                    label: 'Use GIPHY to illustrate Soundcloud',
                    name: 'giphy'
                },
                {
                    dependsOn: {giphy: true},
                    type: 'text',
                    label: 'add Giphy hashtags',
                    name: 'giphyTags'
                },
                {
                    dependsOn: {giphy: true},
                    type: 'checkbox',
                    label: 'VJ Layout',
                    name: 'djLayout'
                }
            ]
        });
        // create a new item and redirect to it
        if (!angular.isDefined($routeParams.showId)) {
            return vm.createShow({type: 'MusicShow', title: 'A Music Show', settings: {giphyTags: 'dance,sunglasses,abstract'}}, true);
        }
        // load the shows
        vm.loadShow();
    }

    angular.module('loopr').controller('EditMusicShowCtrl', EditMusicShowCtrl);

})();
