(function() {
    'use strict';

    angular.module('loopr.player', ['loopr.api', 'loopr.strip', 'loopr.login', 'ui.bootstrap',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'FBAngular', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var headerState = {
                controller: 'StripHeaderCtrl',
                templateUrl: '/static/strip/header/template.html',
                controllerAs: 'vm'
            };
            $urlRouterProvider.otherwise('/');
            $stateProvider
            .state('index', {
                url: '/:username?show&item',
                controller: 'PlayerCtrl',
                templateUrl: '/static/player/player.html',
                controllerAs: 'vm',
                resolve: {
                    loopAuthor: ['$stateParams', 'Accounts', 'Player', 'login', '$state', '$q', 'Shows',
                        function($stateParams, Accounts, Player, login, $state, $q, Shows) {
                        login.login();
                        if (!angular.isDefined($stateParams.username) || $stateParams.username === '' || $stateParams.username === '_=_') {
                            return login.login().then(function(user) {
                                $state.go('index', {username:user.username});
                                return user;
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
                abstract: true,
                views: {
                    header: headerState,
                    body: {
                        template: '<div ui-view="body"></div>'
                    }
                }
            })
            .state('index.open.loop', {
                url: '/loop',
                views: {
                    body: {
                        controller: 'LoopExplorerCtrl',
                        templateUrl: '/static/strip/panels/loop.html',
                        controllerAs: 'vm'
                    }

                }
            })
            .state('index.open.show', {
                url: '/show/:showToExploreId',
                views: {
                    body: {
                        controller: 'ShowExplorerCtrl',
                        templateUrl: '/static/strip/panels/show.html',
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
                url: '/search?q',
                views: {
                    body: {
                        controller: 'SearchCtrl',
                        templateUrl: '/static/strip/panels/search.html',
                        controllerAs: 'vm',
                        resolve: {
                            query: function($stateParams) {
                                return $stateParams.q;
                            },
                            results: function(query, Items) {
                                if (!query) {
                                    return [];
                                }
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
                                }
                            }
                        }
                    }
                }
            });
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
