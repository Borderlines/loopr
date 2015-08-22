(function() {
    'use strict';

    EditMusicShowCtrl.$inject = ['$controller', '$scope', 'Shows', 'embedService',
                                 '$location', '$routeParams', '$route', '$rootScope', '$q'];
    function EditMusicShowCtrl($controller, $scope, Shows, embedService,
                               $location, $routeParams, $route, $rootScope, $q) {
        var vm = $controller('EditShowCtrl as vm', {'$scope': $scope});
        angular.extend(vm, {
            example: 'https://soundcloud.com/chances-with-wolves/live-on-xray-fm'
        })
        // create a new item and redirect to it
        if (!angular.isDefined($routeParams.showId)) {
            return vm.createShow({type: 'MusicShow', title: 'A Music Show'}, true);
        }
        // load the shows
        vm.loadShow();
    }

    angular.module('loopr').controller('EditMusicShowCtrl', EditMusicShowCtrl);

})();
