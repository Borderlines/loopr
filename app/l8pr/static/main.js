import rootReducer from './player/reducers';
import ngRedux from 'ng-redux';
import ngReduxUiRouter from 'redux-ui-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import SoundcloudDirective from './player/soundcloud';
import ProgressionService from './player/services/progression';
import uiRouter from 'angular-ui-router';
import StripCtrl from './strip/strip.ctrl';
import * as actions from './player/actions';
(function() {
    'use strict';
    angular.module('loopr.player', [
        ngRedux,
        ngReduxUiRouter,
        'loopr.api',
        'loopr.strip',
        'loopr.login',
        'ui.bootstrap',
        'loopr.player.vimeo',
        'angular-confirm',
        'cfp.hotkeys',
        'loopr.player.youtube',
        'loopr.player.webtorrent',
        'FBAngular',
        uiRouter])
        .service('progression', ProgressionService)
        .directive('soundcloud', SoundcloudDirective)
        .config(['$stateProvider', '$urlRouterProvider', 'hotkeysProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, hotkeysProvider, $locationProvider) {
            hotkeysProvider.useNgRoute = false;
            $locationProvider.html5Mode({enabled:true}).hashPrefix('#');
            $stateProvider
            .state('resetPassword', {
                url: '/resetpassword?uid&token',
                controllerAs: 'vm',
                controller: 'PlayerCtrl',
                resolve: {
                    loop: ['Player', function(Player) {
                        return Player.loadLoop('discover')
                        .then(function(loop) {
                            return Player.playLoop(loop);
                        });
                    }]
                },
                templateUrl: '/main.html',
                onEnter: ['$state', 'resetPassword',
                function($state, resetPassword) {
                    resetPassword.open().result['finally'](function() {
                        $state.go('root');
                    });
                }]
            })
            .state('open', {
                reloadOnSearch: false,
                url: '/open/{q:.*}',
                controller: ['$stateParams', 'Player', 'login', '$state', '$q', 'Api',
                function($stateParams, Player, login, $state, $q, Api) {
                    function loadLoopAndComplete(username, persist) {
                        return Player.loadLoop(username, $stateParams.item)
                        .then(function(loop) {
                            $q.when((function getUpdatedInboxShow() {
                                if (persist) {
                                    return $q.all([
                                        Api.FindOrCreateItem({url: $stateParams.q}),
                                        Api.FindOrCreateInbox({user: loop.user})
                                    ]).then(function(results) {
                                        var item = results[0], show = results[1];
                                        show.items.unshift(item);
                                        show.put();
                                        _.remove(loop.shows_list, function(s) {
                                            return s.id === show.id;
                                        });
                                        return show;
                                    });
                                } else {
                                    return Api.GetItemMetadata.one().get({url: $stateParams.q})
                                    .then(function(item) {
                                        return {title: 'Open', items: [item]};
                                    });
                                }
                            })()).then(function(show) {
                                loop.shows_list.unshift(show);
                                Player.setLoop(loop);
                                $state.go('root');
                            });
                        });
                    }
                    return login.login().then(function(user) {
                        return loadLoopAndComplete(user.username, true);
                    }, function() {
                        return loadLoopAndComplete('discover', false);
                    });
                }]
            })
            .state('root', {
                url: '/',
                controller: ['$ngRedux', ($ngRedux) => {
                    $ngRedux.dispatch(actions.loadAndStartLoop())
                }],
                template: '<div ui-view="player"></div><div ui-view="strip"></div>',
            })
            .state('root.app', {
                url: ':username/:show/:item',
                reloadOnSearch: false,
                views: {
                    player: {
                        controller: 'PlayerCtrl',
                        templateUrl: '/player/template.html',
                        controllerAs: 'vm'
                    },
                    strip: {
                        templateUrl: '/strip/template.html',
                        controllerAs: 'vm',
                        controller: StripCtrl
                    }
                }
            })
            // .state('root.app.close', {
            // })
            // .state('root.app.open', {
            //     reloadOnSearch: false,
            //     'abstract': true,
            //     resolve: {
            //         // loopToExplore: ['$ngRedux', 'Player',
            //         // function($ngRedux, Player) {
            //         //     const {username, loopToExplore} = $ngRedux.getState().router.currentParams;
            //         //     return Player.loadLoop(loopToExplore || username);
            //         // }],
            //         latestItemsShow: ['Api', function(Api) {
            //             return Api.LatestItems().then(function(items) {
            //                 return {title: 'What\'s new in loopr.tv', items: items, show_type: 'last_item'};
            //             });
            //         }]
            //     },
            //     views: {
            //         header: {
            //             controller: 'StripHeaderCtrl',
            //             templateUrl: '/strip/header/template.html',
            //             controllerAs: 'vm'
            //         },
            //         body: {
            //             template: '<div ui-view="body" class="spinner"></div>'
            //         }
            //     }
            // })
            // .state('root.app.open.loop', {
            //     views: {
            //         body: {
            //             controller: 'LoopExplorerCtrl',
            //             templateUrl: '/strip/loop/template.html',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })
            // .state('root.app.open.show', {
            //     reloadOnSearch: false,
            //     views: {
            //         body: {
            //             controller: 'ShowExplorerCtrl',
            //             templateUrl: '/strip/show/template.html',
            //             controllerAs: 'vm',
            //             resolve: {
            //                 show: ['$stateParams', 'Api', 'ApiCache', '$ngRedux',
            //                 function($stateParams, Api, ApiCache, $ngRedux) {
            //                     var loop = $ngRedux.getState().router.currentParams.username;
            //                     // if a show object is given, open it and update the params
            //                     if ($stateParams.showToExplore) {
            //                         $stateParams.showToExploreId = $stateParams.showToExplore.id;
            //                         if (ApiCache.isDirty) {
            //                             ApiCache.isDirty = false;
            //                             return $stateParams.showToExplore.get();
            //                         } else {
            //                             return $stateParams.showToExplore;
            //                         }
            //                     }
            //                     // if the show is in the current loop, open it (and keep items order)
            //                     var show = _.find(loop.shows_list, function(show) {
            //                         return show.id === parseInt($stateParams.showToExploreId, 10);
            //                     });
            //                     if(show) {
            //                         if (ApiCache.isDirty) {
            //                             ApiCache.isDirty = false;
            //                             return show.get();
            //                         } else {
            //                             return show;
            //                         }
            //                     }
            //                     // otherwise, load from API
            //                     return Api.Shows.one($stateParams.showToExploreId).get();
            //                 }]
            //             }
            //         }
            //     }
            // })
            // .state('root.app.open.latest', {
            //     url: '/latest',
            //     reloadOnSearch: false,
            //     views: {
            //         body: {
            //             controller: 'SearchCtrl',
            //             templateUrl: '/strip/search-results/template.html',
            //             controllerAs: 'vm',
            //             resolve: {
            //                 query: function() {return 'latest';},
            //                 results: ['Api', function(Api) {
            //                     return Api.LatestItems();
            //                 }]
            //             }
            //         }
            //     }
            // })
            // .state('root.app.open.search', {
            //     url: '/search/{q:.*}',
            //     reloadOnSearch: false,
            //     views: {
            //         body: {
            //             controller: 'SearchCtrl',
            //             templateUrl: '/strip/search-results/template.html',
            //             controllerAs: 'vm',
            //             resolve: {
            //                 query: function($stateParams) {
            //                     return $stateParams.q;
            //                 },
            //                 results: ['Api', 'query', function(Api, query) {
            //                     if (query) {
            //                         var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
            //                         if (urlRegex.test(query)) {
            //                             return Api.GetItemMetadata.one().get({url: query}).then(function(item) {
            //                                 return [item];
            //                             });
            //                         } else {
            //                             return Api.Search.getList({'title': query});
            //                         }
            //                     }
            //                     return [];
            //                 }]
            //             }
            //         }
            //     }
            // });
        }])
        .config(['$ngReduxProvider', 'PlayerProvider',
        function($ngReduxProvider, PlayerProvider) {
            const logger = createLogger({
                level: 'info',
                collapsed: true
            });
            $ngReduxProvider.createStoreWith(rootReducer, [
                'ngUiRouterMiddleware',
                thunk.withExtraArgument({ Player: PlayerProvider.$get() }),
                logger
            ]);
        }])
        .service('ApiCache', [function() {
            var self = this;
            angular.extend(self, {
                isDirty: false
            });
        }])
        .service('$history', ['$state', '$rootScope', '$window', function($state, $rootScope, $window) {
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
                            $state.go('root');
                        }
                    }
                }
            });
        }])
        // .config(['$urlRouterProvider', function ($urlRouterProvider) {
        //     $urlRouterProvider.deferIntercept();
        // }])
        // .run(['$rootScope', '$urlRouter', '$location', '$state', function ($rootScope, $urlRouter, $location, $state) {
        //     $rootScope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl) {
        //         e.preventDefault();
        //         if ($state.current.name !== 'root.app') {
        //             console.log('sync');
        //             $urlRouter.sync();
        //         }
        //     });
        //     $urlRouter.listen();
        // }])
        .run(['$history', '$state', '$rootScope', 'hotkeys', '$timeout',
        function($history, $state, $rootScope, hotkeys, $timeout) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                console.log('$stateChangeStart', toState);
                $timeout(function() {
                    $('[ui-view="body"]').addClass('spinner');
                }, 0, false);
            });

            $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                $timeout(function() {
                    $('[ui-view="body"]').removeClass('spinner');
                }, 0, false);
            });
        //     $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        //         if ($history.goingBack) {
        //             $history.goingBack = false;
        //             return;
        //         }
        //         if (!from['abstract'] && !_.contains(['index', 'open', 'resetPassword'], from.name)) {
        //             delete fromParams.show;
        //             delete fromParams.item;
        //             $history.push(from, fromParams);
        //         }
        //     });
            hotkeys.add({
                combo: ['ctrl+f'],
                description: 'Search',
                callback: function(e) {
                    e.preventDefault();
                    $state.go('root.app.open.search').then(function(s) {
                        $rootScope.$emit('openSearch');
                    });
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
