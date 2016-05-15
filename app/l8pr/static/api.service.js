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


    Accounts.$inject = ['Restangular', 'Loops', 'Shows'];
    function Accounts(Restangular, Loops, Shows) {
        Restangular.extendModel('users', function(model) {
            if (angular.isDefined(model.loops)) {
                model.loops = model.loops.map(function(loop) {
                    return Restangular.restangularizeElement(null, loop, 'loops');
                });
            }
            if (angular.isDefined(model.loops) && angular.isDefined(model.loops[0].shows_list)) {
                model.loops[0].shows_list = model.loops[0].shows_list.map(function(show) {
                    return Restangular.restangularizeElement(null, show, 'shows');
                });
            }
            return model;
        });
        return Restangular.service('users');
    }

    Auth.$inject = ['Restangular'];
    function Auth(Restangular) {
        return Restangular.service('auth');
    }

    Loops.$inject = ['Restangular', 'Shows'];
    function Loops(Restangular, Shows) {
        Restangular.extendModel('loops', function(model) {
            if (angular.isDefined(model.shows_list)) {
                model.shows_list = model.shows_list.map(function(show) {
                    return Restangular.restangularizeElement(null, show, 'shows');
                });
            }
            model.duration = function() {
                if (angular.isDefined(model.shows_list)) {
                    return model.shows_list.reduce(function(a, b) {return  a + b.duration();}, 0);
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
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
        }]);
})();
