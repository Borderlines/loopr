(function() {
    'use strict';

    Player.$inject = ['$rootScope', 'localStorageService', '$location', '$state',
    '$timeout', 'login', 'Api', '$q'];
    function Player($rootScope, localStorageService, $location, $state,
    $timeout, login, Api, $q) {
        var self = this;
        angular.extend(self, {
            currentPosition: 0,
            loop: undefined,
            currentShow: undefined,
            currentItem: undefined,
            currentStatus: undefined,
            isMuted: localStorageService.get('muted'),
            setCurrentPosition: function(position) {
                self.currentPosition = position;
            },
            setPosition: function(percent) {
                $rootScope.$broadcast('player.seekTo', percent);
            },
            getStatus: function() {
                return self.currentStatus;
            },
            setStatus: function(status) {
                self.currentStatus = status;
            },
            playPause: function() {
                $rootScope.$broadcast('player.playPause');
            },
            setLoop: function(loop) {
                self.loop = loop;
            },
            playLoop: function(loop, selectedShow, selectedItem) {
                // a show is asked
                var show = _.find(loop.shows_list, function(show) { return show.id.toString() === selectedShow;});
                // a show is asked but not part of the loop, then we add it to the loop
                if (!angular.isDefined(show) && selectedShow) {
                    show = Api.Shows.one(selectedShow).get().then(function(show) {
                        loop.shows_list.push(show);
                        return show;
                    });
                }
                return $q.when(show).then(function(show) {
                    var item_index;
                    // an item is asked
                    if (show && selectedItem) {
                        item_index = _.findIndex(show.items, function(link) {
                            return parseInt(selectedItem, 10) === parseInt(link.id, 10);
                        });
                    }
                    // item not found, play first one
                    if (item_index === -1) {
                        item_index = 0;
                    }
                    self.setLoop(loop);
                    self.playShow(show, item_index);
                    return loop;
                });
            },
            loadLoop: function(usernameOrLoop, selectedItem) {
                return $q.when((function() {
                    if (typeof(usernameOrLoop) === 'string') {
                        return Api.Loops.getList({'username': usernameOrLoop}).then(function(loops) {
                            var loop = loops[0];
                            loop.username = usernameOrLoop;
                            return loop;
                        });
                    } else {
                        return usernameOrLoop;
                    }
                })()).then(function(loop) {
                    // shuffle ?
                    function shuffle(o) {
                        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x); // jshint ignore:line
                        return o;
                    }
                    loop.shows_list.forEach(function(show) {
                        if (show.settings && show.settings.shuffle) {
                            var item_to_save;
                            if (angular.isDefined(selectedItem)) {
                                item_to_save = _.find(show.items, function(link) {
                                    return link.id === selectedItem;
                                });
                            }
                            shuffle(show.items);
                            if (angular.isDefined(item_to_save)) {
                                show.items.splice(0, 0, show.items.splice(show.items.indexOf(item_to_save), 1)[0]);
                            }
                        }
                    });
                    return loop;
                });
            },
            toggleMute: function() {
                self.isMuted = !self.isMuted;
                $rootScope.$broadcast('player.toggleMute');
                localStorageService.set('muted', self.isMuted);
            },
            playItem: function(item) {
                var currentIndex = self.currentShow.items.indexOf(self.currentItem);
                if (currentIndex === -1) {
                    console.error('item not found in', self.currentShow);
                }
                var show = angular.copy(self.currentShow);
                show.items.splice(currentIndex + 1, 0, item);
                self.playShow(show, currentIndex + 1);
            },
            playShow: function(show, index) {
                if (!angular.isDefined(show)) {
                    var now = new Date(),
                    then = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        0,0,0),
                    diff = (now.getTime() - then.getTime()) / 1000;
                    var watch_at = diff % self.loop.duration();
                    var spent = 0;
                    for (var i = 0; i < self.loop.shows_list.length; i++) {
                        if (angular.isDefined(index)) {
                            break;
                        }
                        show = self.loop.shows_list[i];
                        if (spent < watch_at) {
                            if (spent + show.duration() < watch_at) {
                                spent += show.duration();
                            } else {
                                for (var j = 0; j < show.items.length; j++) {
                                    var link = show.items[j];
                                    if (spent + link.duration < watch_at) {
                                        spent += link.duration;
                                    } else {
                                        index = j;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                index = index || 0;
                self.currentShow = show;
                self.currentItem = show.items[index];
                // deep linking
                $timeout(function() {
                    if ($state.current.name.indexOf('index') > -1) {
                        $location.search(angular.extend({}, $location.search(),{show: self.currentShow.id, item: self.currentItem.id}));
                    }
                }, 250, false);
                $timeout(function() {
                    $rootScope.$broadcast('player.play', self.currentItem, self.currentShow);
                });
            },
            nextItem: function() {
                var current_item_index = self.currentShow.items.indexOf(self.currentItem);
                if (self.currentShow.items.length - 1 > current_item_index) {
                    // next item
                    self.playShow(self.currentShow, current_item_index + 1);
                } else {
                    // next show
                    self.nextShow();
                }
            },
            previousItem: function() {
                var current_item_index = self.currentShow.items.indexOf(self.currentItem);
                if (current_item_index - 1 > -1) {
                    // previous item
                    self.playShow(self.currentShow, current_item_index - 1);
                } else {
                    // previous show and last item
                    self.previousShow(true);
                }
            },
            getNextShow: function() {
                var current_index = self.loop.shows_list.indexOf(self.currentShow);
                var next_show = 0;
                if (current_index > -1 && current_index + 1 < self.loop.shows_list.length) {
                    next_show = current_index + 1;
                }
                return self.loop.shows_list[next_show];
            },
            nextShow: function() {
                return self.playShow(self.getNextShow());
            },
            previousShow: function(last) {
                last = last === true;
                var current_index = self.loop.shows_list.indexOf(self.currentShow);
                var previous_show = current_index - 1;
                if (previous_show < 0) {
                    previous_show = self.loop.shows_list.length - 1;
                }
                var show = self.loop.shows_list[previous_show];
                var index = last ? show.items.length - 1 : 0;
                return self.playShow(self.loop.shows_list[previous_show], index);
            }
        });

        return self;
    }

    function bannerService() {
        var service = {
            banner: [],
            setBanner: function(banner) {
                service.banner = banner;
            },
            addQueries: function(queries) {
                if (queries) {
                    var underlines = [];
                    queries.forEach(function(query) {
                        if (angular.isDefined(query.results) && angular.isDefined(query.results.items)) {
                            if (query.type === 'twitter') {
                                query.results.items.forEach(function(tweet) {
                                    underlines.push('<div class="tweet"><i class="icon-sourcetwitter"></i><a href="https://twitter.com/' +
                                    tweet.user.screen_name+'/status/'+tweet.id_str +
                                    '" target="_blank"><b>@'+tweet.user.name+'</b> ' +
                                    tweet.text + '</a></div>');
                                });
                            }
                            if (query.type === 'rss') {
                                query.results.items.forEach(function(rss) {
                                    underlines.push('<div class="rss"><i class="icon-sourcerss"></i><a href="'+rss.link+
                                    '" target="_blank"><b>'+query.results.title+'</b> ' +
                                    rss.title+
                                    '</a></rss>');
                                });
                            }
                        }
                    });
                    service.setBanner(underlines);
                }
            }
        };
        return service;
    }

    angular.module('loopr.player')
    .factory('Player', Player)
    .factory('lowerStrip', function() {
        return bannerService();
    })
    .factory('upperStrip', function() {
        return bannerService();
    });

})();
