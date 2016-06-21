(function() {
    'use strict';

    Api.$inject = ['Restangular'];
    function Api(Restangular) {
        var self = {
            Accounts: Restangular.service('users'),
            Auth: Restangular.service('auth'),
            Register: Restangular.service('register'),
            Items: Restangular.service('items'),
            Search: Restangular.service('search'),
            SearchYoutube: Restangular.service('youtube'),
            GetItemMetadata: Restangular.service('metadata'),
            Shows: (function() {
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
            })(),
            Loops: (function() {
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
            })(),
            FindOrCreateItem: (function() {
                return function(item) {
                    if (item.id) {
                        return item;
                    }
                    return self.Items.getList({url: item.url}).then(function(items) {
                        if (items.length === 0) {
                            return self.Items.post({url: item.url}).then(function(item) {
                                return item;
                            });
                        }
                        return items[0];
                    });
                };
            })()
        };
        return self;
    }

    angular.module('loopr.api', ['restangular', 'LocalStorageModule'])
        .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('loopr')
                .setStorageType('localStorage')
                .setNotify(true, true);
        }])
        .factory('Api', Api)
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRequestSuffix('/');
            // X-CSRFToken
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = $.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            RestangularProvider.setDefaultHeaders({'X-CSRFToken': getCookie('csrftoken')});
        }]);
})();
