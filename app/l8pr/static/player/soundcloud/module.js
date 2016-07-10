(function() {
    'use strict';
    SoundcloudDirective.$inject = ['Player', '$interval', '$timeout', '$q', '$http'];
    function SoundcloudDirective(Player, $interval, $timeout, $q, $http) {
        return {
            scope: {
                soundcloudItem: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var soundcloudPlayer;
                var progressionTracker;

                scope.playPause = function() {
                    soundcloudPlayer.then(function(sound) {
                        if (sound.isPlaying()) {
                            pause();
                        } else {
                            play();
                        }
                    });
                };

                function mute() {
                    soundcloudPlayer.then(function(sound) {
                        sound.setVolume(0);
                    });
                }

                function unmute() {
                    soundcloudPlayer.then(function(sound) {
                        sound.setVolume(1);
                    });
                }

                scope.toggleMute = function() {
                    soundcloudPlayer.then(function(sound) {
                        if (sound.getVolume() === 1) {
                            mute();
                        } else {
                            unmute();
                        }
                    });
                };

                function clear() {
                    if (angular.isDefined(soundcloudPlayer)) {
                        soundcloudPlayer.then(function(sound) {
                            sound.pause();
                        });
                        soundcloudPlayer = null;
                    }
                    $interval.cancel(progressionTracker);
                    Player.setCurrentPosition(0);
                }

                function pause() {
                    Player.setStatus('pause');
                    soundcloudPlayer.then(function(sound) {
                        sound.pause();
                    });
                }

                function play() {
                    Player.setStatus('playing');
                    soundcloudPlayer.then(function(sound) {
                        sound.play();
                    });
                }

                scope.$watch('soundcloudItem', function(n , o) {
                    clear();
                    var soundDeferred = $q.defer();
                    soundcloudPlayer = soundDeferred.promise;
                    SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                    SC.resolve(Player.currentItem.url).then(function(data) {
                        SC.stream(data.uri.replace('https://api.soundcloud.com', '')).then(function(player) {
                            play();
                            soundDeferred.resolve(player);
                            if (Player.isMuted) {
                                mute();
                            }
                            $interval.cancel(progressionTracker);
                            progressionTracker = $interval(function() {
                                if (player.streamInfo) {
                                    Player.setCurrentPosition((player.currentTime() /  player.streamInfo.duration) * 100);
                                    if (player.currentTime() >  player.streamInfo.duration - 5){
                                        Player.nextItem();
                                    }
                                }
                            }, 250);
                        });
                    });
                });
                scope.$on('player.seekTo', function(e, percent) {
                    soundcloudPlayer.then(function(sound) {
                        sound.seek(Math.ceil((percent/100) * sound.streamInfo.duration));
                    });
                });
                scope.$on('player.toggleMute', scope.toggleMute);
                scope.$on('player.playPause', scope.playPause);
                scope.$on('$destroy', function() {
                    clear();
                });
            }
        };
    }
    angular.module('loopr.player').directive('soundcloud', SoundcloudDirective);

})();
