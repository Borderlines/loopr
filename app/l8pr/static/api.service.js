(function() {
    'use strict';

    Shows.$inject = ['Restangular'];
    function Shows(Restangular) {
        Restangular.extendModel('shows', function(model) {
            model.duration = function() {
                if (angular.isDefined(model.items)) {
                    return model.items.reduce(function(a, b) {return  a + b.duration;}, 0);
                }
            };
            model.listTypes = function() {
                var types = model.items.map(function(link) {
                    return link.provider_name;
                });
                if (_.contains(types, 'SoundCloud') && model.settings.giphy) {
                    types.push('Giphy');
                }
                return _.unique(types);
            };
            return model;
        });
        return Restangular.service('shows');
    }


    Accounts.$inject = ['Restangular'];
    function Accounts(Restangular) {
        return Restangular.service('users');
    }

    Auth.$inject = ['Restangular'];
    function Auth(Restangular) {
        return Restangular.service('auth');
    }

    Loops.$inject = ['Restangular'];
    function Loops(Restangular) {
        Restangular.extendModel('loops', function(model) {
            if (angular.isDefined(model.shows)) {
                model.shows = model.shows.map(function(show) {
                    return Restangular.restangularizeElement(null, show, 'shows');
                });
            }
            model.duration = function() {
                if (angular.isDefined(model.shows)) {
                    return model.shows.reduce(function(a, b) {return  a + b.duration();}, 0);
                }
            };
            return model;
        });
        return Restangular.service('loops');
    }

    angular.module('loopr.api', ['restangular', 'LocalStorageModule'])
        .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('loopr')
                .setStorageType('localStorage')
                .setNotify(true, true);
        }])
        .factory('Shows', Shows)
        .factory('Loops', Loops)
        .factory('Accounts', Accounts)
        .factory('Auth', Auth)
        .service('login', ['Restangular', 'localStorageService', 'Accounts', '$rootScope', '$location', '$window', 'Auth',
        function(Restangular, localStorageService, Accounts, $rootScope, $location, $window, Auth) {
            $rootScope.user = {};
            var service = {
                loginWithFb: function() {
                    $window.location.href = '/auth/login/facebook';
                },
                logout: function() {
                    service.currentUser = undefined;
                    return Auth.one('logout').get();
                },
                login: function() {
                    return Accounts.one('me').get().then(function(currentUser) {
                        $rootScope.currentUser = currentUser;
                        service.currentUser = currentUser;
                        return currentUser;
                    });
                }
            };
            return service;
        }])
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
        }])
        .directive('addToFavorite', [function() {
            return {
                template: ['<span class="add-to-favs" ng-class="{\'active\': vm.inFavorites}"',
                           ' ng-click="vm.addToFavs(); $event.stopPropagation();">',
                           '<i class="fa fa-star"></i></span>'].join(''),
                scope: {
                    user: '='
                },
                controllerAs: 'vm',
                controller: ['login', '$scope', function(login, $scope) {
                    var vm = this;
                    angular.extend(vm, {
                        inFavorites: undefined,
                        addToFavs: function() {
                            login.login().then(function(user) {
                                user.favorites = user.favorites || [];
                                var to_fav = $scope.user;
                                // add
                                if (user.favorites.indexOf(to_fav) === -1) {
                                    user.favorites.push(to_fav);
                                    user.patch(_.pick(user, 'favorites'));
                                    vm.inFavorites = true;
                                // remove
                                } else {
                                    user.favorites.splice(user.favorites.indexOf(to_fav), 1);
                                    user.patch(_.pick(user, 'favorites'));
                                    vm.inFavorites = false;
                                }
                            });
                        }
                    });
                    // init fav state
                    login.login().then(function(user) {
                        vm.inFavorites = user.favorites.indexOf($scope.user) > -1;
                    });
                }]
            };
        }])
        .filter('seconds', function() {
            return function(time) {
                if (angular.isDefined(time) && angular.isNumber(time) && !isNaN(time)) {
                    var hours = Math.floor(time / 3600);
                    time = time - hours * 3600;
                    var minutes = Math.floor(time / 60);
                    var time_str = '';
                    if (hours > 0) {
                        time_str += hours + 'h';
                    }
                    return time_str + minutes + 'm';
                }
            };
        });
})();
