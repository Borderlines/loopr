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
            if (angular.isDefined(model.loops) && model.loops.length > 0 && angular.isDefined(model.loops[0].shows_list)) {
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

    Items.$inject = ['Restangular'];
    function Items(Restangular) {
        return Restangular.service('items');
    }

    Search.$inject = ['Restangular'];
    function Search(Restangular) {
        return Restangular.service('search');
    }

    SearchYoutube.$inject = ['Restangular'];
    function SearchYoutube(Restangular) {
        return Restangular.service('youtube');
    }

    GetItemMetadata.$inject = ['Restangular'];
    function GetItemMetadata(Restangular) {
        return Restangular.service('metadata');
    }

    FindOrCreateItem.$inject = ['Items'];
    function FindOrCreateItem(Items) {
        return function(item) {
            return Items.getList({url: item.url}).then(function(items) {
                if (items.length === 0) {
                    return Items.post({url: item.url}).then(function(item) {
                        return item;
                    });
                }
                return items[0];
            });
        };
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
        .factory('Items', Items)
        .factory('Search', Search)
        .factory('SearchYoutube', SearchYoutube)
        .factory('getItemMetadata', GetItemMetadata)
        .factory('Accounts', Accounts)
        .factory('Auth', Auth)
        .factory('findOrCreateItem', FindOrCreateItem)
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
