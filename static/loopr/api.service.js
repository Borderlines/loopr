(function() {
    'use strict';

    Shows.$inject = ['Restangular'];
    function Shows(Restangular) {
        Restangular.extendModel('shows', function(model) {
            model.duration = function() {
                if (angular.isDefined(model.links)) {
                    return model.links.reduce(function(a, b) {return  a + b.duration;}, 0);
                }
            };
            return model;
        });
        return Restangular.service('shows');
    }


    Accounts.$inject = ['Restangular'];
    function Accounts(Restangular) {
        return Restangular.service('accounts');
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
        .service('login', ['Restangular', 'localStorageService', 'Accounts', '$rootScope', '$location',
        function(Restangular, localStorageService, Accounts, $rootScope, $location) {
            $rootScope.user = {};
            var service = {
                login: function(username, password) {
                    if (angular.isDefined(username)) {
                        localStorageService.set('auth', btoa(username + ':' + password));
                    } else if (localStorageService.get('user')) {
                        username =  localStorageService.get('user').username;
                    }
                    if (angular.isDefined(username)) {
                        Restangular.setDefaultHeaders({'Authorization':'Basic ' + localStorageService.get('auth')});
                        return Accounts.one(username).get({timestamp: new Date()}).then(function(data) {
                            localStorageService.set('user', data);
                            service.user = data;
                            $rootScope.user = data;
                            return data;
                        });
                    }
                },
                logout: function() {
                    localStorageService.remove('user');
                    localStorageService.remove('auth');
                    Restangular.setDefaultHeaders({'Authorization':''});
                    service.user = null;
                    $rootScope.user = null;
                    $location.url('/');
                },
                auth: localStorageService.get('auth'),
                user: $rootScope.user,
                getCurrentUser: function() {
                    return Accounts.one(localStorageService.get('user')._id).get();
                }
            };
            $rootScope.$on('unauthorized', service.logout);
            $rootScope.logout = service.logout;
            return service;
        }])
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: '_id',
                etag: '_etag'
            });
            RestangularProvider.addRequestInterceptor(function(element, operation, route, url, a, b) {
                if (operation === 'put') {
                    delete element._id;
                    delete element._updated;
                    delete element._links;
                    delete element._created;
                    delete element.user_id;
                    delete element._etag;
                    delete element._status;
                }
                return element;
            });
            RestangularProvider.setDefaultHttpFields({cache: false});
            // add a response interceptor
            RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                if (operation === 'getList') {
                    var extractedData;
                    extractedData = data._items;
                    extractedData.meta = data._meta;
                    return extractedData;
                }
                return data;
            });
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
