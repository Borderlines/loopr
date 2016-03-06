(function() {
    'use strict';

    EditVideoShowCtrl.$inject = ['$controller', '$scope', 'Shows', 'embedService',
                                 '$location', '$routeParams', '$route', '$rootScope', '$q'];
    function EditVideoShowCtrl($controller, $scope, Shows, embedService,
                               $location, $routeParams, $route, $rootScope, $q) {
        var vm = $controller('EditShowCtrl as vm', {'$scope': $scope});
        angular.extend(vm, {

        });
        // create a new item and redirect to it
        if (!angular.isDefined($routeParams.showId)) {
            return vm.createShow({type: 'VideoShow', title: 'A Video Show'}, true);
        }
        // load the shows
        vm.loadShow();
    }

    angular.module('loopr').controller('EditVideoShowCtrl', EditVideoShowCtrl);

})();
