(function() {
    'use strict';

    CatalogCtrl.$inject = ['Loops', 'Accounts'];
    function CatalogCtrl(Loops, Accounts) {
        var vm = this;
        Loops.getList({embedded:{shows:1}}).then(function(loops) {
            loops.forEach(function(loop) {
                Accounts.one(loop.user_id).get().then(function(user) {
                    loop.user = user;
                });
            });
            vm.loops = loops;
        });
    }

    angular.module('loopr.catalog', ['ngRoute', 'loopr.api'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
            .when('/catalog', {
                controller: CatalogCtrl,
                templateUrl: '/static/loopr/catalog/main.html',
                controllerAs: 'vm',
                reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }]);
})();
