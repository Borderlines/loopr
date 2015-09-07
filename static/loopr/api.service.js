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
            model.duration = function() {
                if (angular.isDefined(model.shows)) {
                    model.shows = model.shows.map(function(show) {
                        return Restangular.restangularizeElement(null, show, 'shows');
                    });
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
            var username;
            if (localStorageService.get('user')) {
                username = localStorageService.get('user').username;
            }
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
                            service.username = data.username;
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
                user: username,
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
        }]);

})();
