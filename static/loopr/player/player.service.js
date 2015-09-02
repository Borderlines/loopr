(function() {
    'use strict';

    Player.$inject = ['$rootScope'];
    function Player($rootScope) {
        var self = this;
        angular.extend(self, {
            currentPosition: 0,
            loop: undefined,
            currentShow: undefined,
            currentItem: undefined,
            currentStatus: undefined,
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
                    for (var i = 0; i < self.loop.shows.length; i++) {
                        if (angular.isDefined(index)) {
                            break;
                        }
                        show = self.loop.shows[i];
                        if (spent < watch_at) {
                            if (spent + show.duration() < watch_at) {
                                spent += show.duration();
                            } else {
                                for (var j = 0; j < show.links.length; j++) {
                                    var link = show.links[j];
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
                self.currentItem = show.links[index];
                $rootScope.$broadcast('player.play', self.currentItem, self.currentShow);
            },
            getNextItem: function() {
                var current_item_index = self.currentShow.links.indexOf(self.currentItem);
                if (self.currentShow.links.length - 1 > current_item_index) {
                    return self.currentShow.links[current_item_index + 1];
                } else {
                    return self.getNextShow().links[0];
                }
            },
            nextItem: function() {
                var current_item_index = self.currentShow.links.indexOf(self.currentItem);
                if (self.currentShow.links.length - 1 > current_item_index) {
                    // next item
                    self.playShow(self.currentShow, current_item_index + 1);
                } else {
                    // next show
                    self.nextShow();
                }
            },
            previousItem: function() {
                var current_item_index = self.currentShow.links.indexOf(self.currentItem);
                if (current_item_index - 1 > -1) {
                    // previous item
                    self.playShow(self.currentShow, current_item_index - 1);
                } else {
                    // previous show and last item
                    self.previousShow(true);
                }
            },
            getNextShow: function() {
                var current_index = self.loop.shows.indexOf(self.currentShow);
                var next_show = 0;
                if (current_index > -1 && current_index + 1 < self.loop.shows.length) {
                    next_show = current_index + 1;
                }
                return self.loop.shows[next_show];
            },
            nextShow: function() {
                return self.playShow(self.getNextShow());
            },
            previousShow: function(last) {
                last = last === true;
                var current_index = self.loop.shows.indexOf(self.currentShow);
                var previous_show = current_index - 1;
                if (previous_show < 0) {
                    previous_show = self.loop.shows.length - 1;
                }
                var show = self.loop.shows[previous_show];
                var index = last ? show.links.length - 1 : 0;
                return self.playShow(self.loop.shows[previous_show], index);
            }
        });

        return self;
    }

    angular.module('loopr.player').factory('Player', Player);

})();
