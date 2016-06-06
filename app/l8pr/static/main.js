(function() {
    'use strict';

    angular.module('loopr.player', ['loopr.api', 'loopr.strip', 'loopr.login', 'ui.bootstrap', 'loopr.player.vimeo',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'FBAngular', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
            .state('index', {
                reloadOnSearch: false,
                url: '/:username?show&item',
                controller: 'PlayerCtrl',
                templateUrl: '/main.html',
                controllerAs: 'vm',
                resolve: {
                    loop: ['$stateParams', 'Loops', 'Player', 'login', '$state', '$q', 'Shows',
                        function($stateParams, Loops, Player, login, $state, $q, Shows) {
                        if (!angular.isDefined($stateParams.username) || $stateParams.username === '' || $stateParams.username === '_=_') {
                            return login.login().then(function(user) {
                                $state.go('index', {username: user.username});
                            }, function() {
                                $state.go('index', {username: 'discover'});
                            });
                        }
                        if (angular.isDefined(Player.loop)) {
                            Player.playShow(Player.loop.shows_list[0], 0);
                            return Player.loop;
                        }
                        return Player.loadLoop($stateParams.username, $stateParams.item)
                        .then(function(loop) {
                            return Player.playLoop(loop, $stateParams.show, $stateParams.item);
                        });
                    }]
                }
            })
            .state('index.open', {
                reloadOnSearch: false,
                'abstract': true,
                views: {
                    header: {
                        controller: 'StripHeaderCtrl',
                        templateUrl: '/strip/header/template.html',
                        controllerAs: 'vm'
                    },
                    body: {
                        template: '<div ui-view="body"></div>'
                    }
                }
            })
            .state('index.open.loop', {
                reloadOnSearch: false,
                url: '/loop',
                views: {
                    body: {
                        controller: 'LoopExplorerCtrl',
                        templateUrl: '/strip/loop/template.html',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('index.open.show', {
                reloadOnSearch: false,
                url: '/show/:showToExploreId',
                views: {
                    body: {
                        controller: 'ShowExplorerCtrl',
                        templateUrl: '/strip/show/template.html',
                        controllerAs: 'vm',
                        resolve: {
                            show: function($stateParams, Shows) {
                                return Shows.one($stateParams.showToExploreId).get();
                            }
                        }
                    }
                }
            })
            .state('index.open.search', {
                url: '/search/{q:.*}',
                reloadOnSearch: false,
                views: {
                    body: {
                        controller: 'SearchCtrl',
                        templateUrl: '/strip/search-results/template.html',
                        controllerAs: 'vm',
                        resolve: {
                            query: function($stateParams) {
                                return $stateParams.q;
                            },
                            results: ['findOrCreateItem', 'query', 'Items', 'Search',
                            function(findOrCreateItem, query, Items, Search) {
                                if (query) {
                                    var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
                                    if (urlRegex.test(query)) {
                                        return findOrCreateItem({url: query}).then(function(item) {
                                            return [item];
                                        });
                                    } else {
                                        return Search.getList({'title': query});
                                    }
                                }
                                return [];
                            }]
                        }
                    }
                }
            })
            .state('open', {
                reloadOnSearch: false,
                url: '/open/{q:.*}',
                controller: ['$stateParams', 'Accounts', 'Player', 'login', '$state', '$q', 'Shows', 'getItemMetadata',
                function($stateParams, Accounts, Player, login, $state, $q, Shows, getItemMetadata) {
                    return getItemMetadata.one().get({url: $stateParams.q}).then(function(item) {
                        function loadLoopAndComplete(username) {
                            return Player.loadLoop(username, $stateParams.item)
                            .then(function(loop) {
                                loop.shows_list.unshift({items: [item]});
                                Player.setLoop(loop);
                                $state.go('index');
                            });
                        }
                        return login.login().then(function(user) {
                            loadLoopAndComplete(user.username);
                        }, function() {
                            loadLoopAndComplete('discover');
                        });
                    });
                }]
            });
        }])
        .service('$history', function($state, $rootScope, $window) {
            var history = [];
            var self = this;
            angular.extend(self, {
                push: function(state, params) {
                    if (history.length > 0 && state.name === history[history.length - 1].state.name) {
                        // if last state has the same name, update it
                        history[history.length - 1].params = params;
                    } else {
                        // if not, push a new state
                        history.push({ state: state, params: params });
                    }
                },
                // used in $stateChangeSuccess handler to know if change comes from back function
                goingBack: false,
                back: function(fallback) {
                    var prev = history.pop();
                    self.goingBack = true;
                    if (angular.isDefined(prev)) {
                        return $state.go(prev.state, prev.params);
                    } else {
                        if (fallback) {
                            $state.go(fallback);
                        } else {
                            $state.go('index');
                        }
                    }
                }
            });
        })
        .run(function($history, $state, $rootScope) {
            $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
                if ($history.goingBack) {
                    $history.goingBack = false;
                    return;
                }
                if (!from['abstract'] && !_.contains(['index', 'open'], from.name)) {
                    delete fromParams.show;
                    delete fromParams.item;
                    $history.push(from, fromParams);
                }
            });
        })
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
