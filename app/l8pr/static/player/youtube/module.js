(function() {
    'use strict';
    YoutubeDirective.$inject = ['Player', '$interval', '$rootScope'];
    function YoutubeDirective(Player, $interval, $rootScope) {
        return {
            scope: {
                item: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var plyrPlayer = window.plyr.setup(element.get(0), {
                    autoplay: true, controls: []
                })[0];
                scope.$on('player.playPause', function() {
                    plyrPlayer.togglePlay();
                });
                scope.$on('player.toggleMute', function() {
                    plyrPlayer.setVolume((Player.isMuted) ? 0 : 100);
                });
                scope.$on('player.seekTo', function(e, percent) {
                    plyrPlayer.seek((percent/100) * plyrPlayer.embed.getDuration());
                });
                scope.$watch('item', function() {
                    try {
                        plyrPlayer.source({
                            type: 'video',
                            sources: [{
                                src: getYoutubeId(scope.item.url),
                                type: 'youtube'
                            }]
                        });
                    // returns an error from a missing button.
                    } catch (e) {}
                });
                var progressionTracker;
                function getYoutubeId(url) {
                    var videoId = url.split('v=')[1];
                    var ampersandPosition = videoId.indexOf('&');
                    if(ampersandPosition !== -1) {
                        videoId = videoId.substring(0, ampersandPosition);
                    }
                    return videoId;
                }
                function trackProgression(media) {
                    $interval.cancel(progressionTracker);
                    progressionTracker = $interval(function() {
                        Player.setCurrentPosition((media.getCurrentTime() / media.getDuration()) * 100);
                    }, 250);
                }
                var playerEvents = {
                    error: function(event) {
                        $interval.cancel(progressionTracker);
                        Player.setCurrentPosition(0);
                        Player.nextItem();
                    },
                    playing: function(event) {
                        Player.setStatus('playing');
                        plyrPlayer.setVolume((Player.isMuted) ? 0 : 100);
                        trackProgression(plyrPlayer.embed);
                    },
                    pause: function(event) {
                        Player.setStatus('pause');
                    },
                    ended: function(event) {
                        $interval.cancel(progressionTracker);
                        Player.setCurrentPosition(0);
                        Player.nextItem();
                    }
                };
                angular.forEach(playerEvents, function(eventHandler, eventName) {
                    element.get(0).addEventListener(eventName, eventHandler);
                });
                scope.$on('$destroy', function() {
                    $interval.cancel(progressionTracker);
                    angular.forEach(playerEvents, function(eventHandler, eventName) {
                        element.get(0).removeEventListener(eventName, eventHandler);
                    });
                    plyrPlayer.destroy();
                });
            },
            template: [
                '<div class="plyr">',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player.youtube', []).directive('youtube', YoutubeDirective);

})();
