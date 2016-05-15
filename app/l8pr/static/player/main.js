(function() {
    'use strict';

    angular.module('loopr.player', ['loopr.api', 'loopr.strip', 'loopr.login',
                                    'cfp.hotkeys', 'loopr.player.youtube', 'FBAngular', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
                                // lowerStrip.addQueries(loop.strip_messages);
                                // vm.loop = loop;
                                var item_index;
                                if (show && $stateParams.item) {
                                    item_index = _.findIndex(show.items, function(link) {
                                        return parseInt($stateParams.item, 10) === parseInt(link.id, 10);
                                    });
                                }
                                Player.playShow(show, item_index);
                                // return loop;
                                return user;
                            });
                        });
                    }]
                }
            })
            .state('index.loop', {
                url: '/loop',
                views: {
                    body: {
                        controller: 'LoopExplorerCtrl',
                        templateUrl: '/static/strip/panels/loop.html',
                        controllerAs: 'vm'
                    },
                    header: {
                        controller: 'StripHeaderCtrl',
                        templateUrl: '/static/strip/header/template.html',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('index.show', {
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
                    },
                    header: {
                        controller: 'StripHeaderCtrl',
                        templateUrl: '/static/strip/header/template.html',
                        controllerAs: 'vm'
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
