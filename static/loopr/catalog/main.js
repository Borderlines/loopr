(function() {
    'use strict';

    CatalogCtrl.$inject = ['Loops', 'Accounts', '$scope', 'Shows'];
    function CatalogCtrl(Loops, Accounts, $scope, Shows) {
        var vm = this;
        Accounts.one($scope.user).get().then(function(user) {
            Loops.getList({where:{user_id: user._id}, embedded:{shows:1}}).then(function(loops) {
                var loop = loops[0];
                angular.extend(loop, {
                    shows: loop.shows
                        .sort(function(a,b) {
                            return a._updated < b._updated;
                        })
                        .splice(0, $scope.maxShow || loop.shows.length),
                    user: user
                });
                vm.loop = loop;
            });
        });
    }


    angular.module('loopr.catalog', ['ngRoute', 'loopr.api'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
            .when('/catalog', {
                templateUrl: '/static/loopr/catalog/all.html',
                reloadOnSearch:false
            })
            .when('/catalog/:username', {
                templateUrl: '/static/loopr/catalog/user.html',
                controllerAs: 'vm',
                controller: ['$routeParams', function($routeParams) {
                    var vm = this;
                    vm.user = $routeParams.username;
                }],
                reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }])
        .directive('catalog', [function() {
            return {
                templateUrl: '/static/loopr/catalog/catalog.html',
                controllerAs: 'vm',
                controller: CatalogCtrl,
                scope: {
                    user: '=',
                    maxShow: '='
                }
            };
        }]);
})();
