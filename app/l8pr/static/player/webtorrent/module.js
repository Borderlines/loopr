(function() {
    'use strict';
    WebtorrentDirective.$inject = ['Player', '$interval', '$rootScope', '$window'];
    function WebtorrentDirective(Player, $interval, $rootScope, $window) {
        return {
            scope: {
                item: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var client, player, interval;
                var playerEvents = {
                        error: function(event) {
                            Player.setCurrentPosition(0);
                            Player.nextItem();
                        },
                        playing: function(event) {
                            Player.setStatus('playing');
                            Player.volume = (player.muted) ? 0 : 1;
                        },
                        timeupdate: function(event) {
                            Player.setCurrentPosition((player.currentTime / player.duration) * 100);
                        },
                        pause: function(event) {
                            Player.setStatus('pause');
                        },
                        ended: function(event) {
                            Player.setCurrentPosition(0);
                            Player.nextItem();
                        }
                    };
                scope.$watch('item', function() {
                    init();
                });
                function init() {
                    $interval.cancel(interval);
                    if (client) {
                        client.destroy();
                        angular.extend(scope, {
                            torrent: {}
                        });
                        client = null;
                    }
                    if (player) {
                        angular.forEach(playerEvents, function(eventHandler, eventName) {
                            player.removeEventListener(eventName, eventHandler);
                        });
                        player = null;
                    }
                    element.find('video').remove();
                    client = new $window.WebTorrent();
                    client.add(scope.item.url, function (torrent) {
                        interval = $interval(function() {
                            angular.extend(scope, {
                                torrent: torrent
                                // progress: torrent.progress
                            });
                        }, 1000);
                        var file = torrent.files[0];
                        file.appendTo(element.get(0), function ready(err) {
                            player = element.find('video').get(0);
                            // var progressionTracker;
                            scope.$on('player.playPause', function() {
                                if (player.paused) {
                                    player.play();
                                    } else {
                                    player.pause();
                                }
                            });
                            scope.$on('player.seekTo', function(e, percent) {
                                player.currentTime = (percent/100) * player.duration;
                            });
                            scope.$on('player.toggleMute', function() {
                                player.volume = (Player.isMuted) ? 0 : 1;
                            });
                            angular.forEach(playerEvents, function(eventHandler, eventName) {
                                player.addEventListener(eventName, eventHandler);
                            });
                            scope.$on('$destroy', function() {
                                angular.forEach(playerEvents, function(eventHandler, eventName) {
                                    player.removeEventListener(eventName, eventHandler);
                                });
                            });
                        });
                    });
                }
            },
            template: [
                '<div class="webtorrent__info">',
                '<div>Progress: {{ torrent.progress * 100 }}%</div>',
                '<div>downloadSpeed: {{ torrent.downloadSpeed / 1024 }} Kbytes/sec</div>',
                '<div>numPeers: {{ torrent.numPeers }}</div>',
                '<div>timeRemaining: {{ torrent.timeRemaining / 1000 | seconds }}</div>',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player.webtorrent', []).directive('webtorrent', WebtorrentDirective);

})();
