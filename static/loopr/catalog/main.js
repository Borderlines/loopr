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


    angular.module('loopr.catalog', ['loopr.api'])
        .controller('CatalogAllUsers', ['Loops', function(Loops) {
            var vm = this;
            Loops.getList({where: {active: true}, sort: '-_updated', embedded:{user_id: 1}}).then(function(loops) {
                vm.users = loops.map(function(loop) {
                    return loop.user_id;
                });
            });
        }])
        .controller('CatalogFavorites', ['Accounts', 'login', function(Accounts, login) {
            var vm = this;
            login.getCurrentUser().then(function(user) {
                vm.users = user.favorites;
            });
        }])
        .controller('CatalogUser', ['$routeParams', 'Accounts', 'gravatarService',
                                   function($routeParams, Accounts, gravatarService) {
            var vm = this;
            vm.user = $routeParams.username;
            Accounts.one(vm.user).get().then(function(user) {
                vm.avatar = gravatarService.url(user.email, {size: 250});
            });
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
