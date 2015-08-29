(function() {
    'use strict';

    CatalogCtrl.$inject = ['Loops', 'Accounts', '$scope', 'Shows', '$q'];
    function CatalogCtrl(Loops, Accounts, $scope, Shows, $q) {
        var vm = this;
        var user;
        if (typeof($scope.user) === 'object') {
            user = $scope.user;
        } else {
            user = Accounts.one($scope.user).get();
        }
        $q.when(user).then(function(user) {
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
            .when('/', {
                templateUrl: '/static/loopr/catalog/all.html',
                controller: ['Accounts', function(Accounts) {
                    var vm = this;
                    vm.users = Accounts.getList().then(function(users) {
                        vm.users = users;
                    });
                }],
                controllerAs: 'vm',
                // reloadOnSearch:false
            })
            .when('/:username', {
                templateUrl: '/static/loopr/catalog/user.html',
                controller: ['$routeParams', function($routeParams) {
                    var vm = this;
                    vm.user = $routeParams.username;
                }],
                controllerAs: 'vm',
                // reloadOnSearch:false
            });
            $locationProvider.html5Mode({enabled: true, requireBase: true});
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
