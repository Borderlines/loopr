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
                var progressionTracker;
                angular.extend(scope, {
                    youtubeConfig: {
                        controls: 0,
                        autoplay: 1,
                        showinfo: 0,
                        wmode: 'opaque'
                    }
                });
                $rootScope.$on('youtube.player.error', function() {
                    $interval.cancel(progressionTracker);
                    Player.setCurrentPosition(0);
                    Player.nextItem();
                });
                $rootScope.$on('youtube.player.ended', function() {
                    $interval.cancel(progressionTracker);
                    Player.setCurrentPosition(0);
                    Player.nextItem();
                });
                scope.$on('player.playPause', function() {
                    if (scope.youtubePlayer.getPlayerState() === 2) {
                        scope.youtubePlayer.playVideo();
                    } else {
                        scope.youtubePlayer.pauseVideo();
                    }
                });
                scope.$on('player.toggleMute', function() {
                    if(scope.youtubePlayer.getVolume() === 100) {
                        scope.youtubePlayer.setVolume(0);
                    } else {
                        scope.youtubePlayer.setVolume(100);
                    }
                });
                scope.$on('player.seekTo', function(e, percent) {
                    scope.youtubePlayer.seekTo((percent/100) * scope.youtubePlayer.getDuration());
                });
                $rootScope.$on('youtube.player.paused', function(e, player) {
                    Player.setStatus('pause');
                });
                $rootScope.$on('youtube.player.playing', function(e, player) {
                    Player.setStatus('playing');
                    if (Player.isMuted) {
                        scope.youtubePlayer.setVolume(0);
                    }
                    trackProgression(player.getCurrentTime.bind(player), player.getDuration.bind(player));
                });
                function trackProgression(current, total) {
                    $interval.cancel(progressionTracker);
                    progressionTracker = $interval(function() {
                        Player.setCurrentPosition((current() / total()) * 100);
                    }, 250);
                }
                scope.$watch('item', function() {
                    scope.youtubeUrl = scope.item.url;
                });
                scope.$on('$destroy', function() {
                    $interval.cancel(progressionTracker);
                    // TODO: destroy all youtube events
                });
            },
            template: [
                '<youtube-video video-url="youtubeUrl"',
                '               player-vars="youtubeConfig"',
                '               player="youtubePlayer"',
                '               player-width="\'100%\'"',
                '               player-height="\'100%\'">',
                '</youtube-video>'
            ].join('')
        };
    }
    angular.module('loopr.player.youtube', ['youtube-embed']).directive('youtube', YoutubeDirective);

})();
