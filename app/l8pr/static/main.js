(function() {
    'use strict';

    angular.module('loopr.player', ['loopr.api', 'loopr.strip', 'loopr.login', 'ui.bootstrap',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'FBAngular', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var headerState = {
                controller: 'StripHeaderCtrl',
                templateUrl: '/strip/header/template.html',
                controllerAs: 'vm'
            };
            $urlRouterProvider.otherwise('/');
            $stateProvider
            .state('index', {
                reloadOnSearch: false,
                url: '/:username?show&item',
                controller: 'PlayerCtrl',
                templateUrl: '/main.html',
                controllerAs: 'vm',
                resolve: {
                    loopAuthor: ['$stateParams', 'Accounts', 'Player', 'login', '$state', '$q', 'Shows',
                        function($stateParams, Accounts, Player, login, $state, $q, Shows) {
                        login.login();
                        if (!angular.isDefined($stateParams.username) || $stateParams.username === '' || $stateParams.username === '_=_') {
                            return login.login().then(function(user) {
                                $state.go('index', {username:user.username});
                            });
                        }
                        return Accounts.one('username/' + $stateParams.username).get().then(function(user) {
                            var loop = user.loops[0];
                            Player.setLoop(loop);
                            loop.user = user;
                            // shuffle ?
                            function shuffle(o) {
                                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                                return o;
                            }
                            loop.shows_list.forEach(function(show) {
                                if (show.settings && show.settings.shuffle) {
                                    var item_to_save;
                                    if (angular.isDefined($stateParams.item)) {
                                        item_to_save = _.find(show.items, function(link) {
                                            return link.id === $stateParams.item;
                                        });
                                    }
                                    shuffle(show.items);
                                    if (angular.isDefined(item_to_save)) {
                                        show.items.splice(0, 0, show.items.splice(show.items.indexOf(item_to_save), 1)[0]);
                                    }
                                }
                            });
                            var show = _.find(loop.shows_list, function(show) { return show.id.toString() === $stateParams.show;});
                            if (!angular.isDefined(show) && $stateParams.show) {
                                show = Shows.one($stateParams.show).get().then(function(show) {
                                    loop.shows_list.push(show);
                                    return show;
                                });
                            }
                            return $q.when(show).then(function(show) {
                                var item_index;
                                if (show && $stateParams.item) {
                                    item_index = _.findIndex(show.items, function(link) {
                                        return parseInt($stateParams.item, 10) === parseInt(link.id, 10);
                                    });
                                }
                                if (item_index === -1) {
                                    item_index = 0;
                                }
                                Player.playShow(show, item_index);
                                return user;
                            });
                        });
                    }]
                }
            })
            .state('index.open', {
                reloadOnSearch: false,
                abstract: true,
                views: {
                    header: headerState,
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
                url: '/search/:q',
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
                            results: function(query, Items, Search) {
                                if (query) {
                                    var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
                                    if (urlRegex.test(query)) {
                                        return Items.getList({url: query}).then(function(items) {
                                            if (items.length === 0) {
                                                return Items.post({url: query}).then(function(item) {
                                                    return [item];
                                                });
                                            }
                                            return items;
                                        });
                                    } else {
                                        return Search.getList({'title': query});
                                    }
                                }
                                return [];
                            }
                        }
                    }
                }
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
                if (!from['abstract'] && from.name !== 'index') {
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
