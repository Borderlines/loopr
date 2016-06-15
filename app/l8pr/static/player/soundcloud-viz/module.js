(function() {
    'use strict';
    SoundcloudVizDirective.$inject = ['Player', '$interval', '$timeout', '$q', '$http'];
    function SoundcloudVizDirective(Player, $interval, $timeout, $q, $http) {
        return {
            scope: {
                soundcloudItem: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var soundcloudPlayer;
                var progressionTracker;
                var gifTimeout;
                var layoutTimeout;
                var layouts = ['default', 'symmetry', 'repeat'];
                var giphy_keywords = Player.currentShow.settings &&
                                     Player.currentShow.settings.giphy_tags &&
                                     Player.currentShow.settings.giphy_tags.split(',') || [];
                var giphy_url = '//api.giphy.com/v1/gifs/random?rating=r&api_key=dc6zaTOxFJmzC&tag=';

                scope.playPause = function() {
                    soundcloudPlayer.then(function(sound) {
                        if (sound.getState() === 'paused') {
                            play();
                        } else {
                            pause();
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
                    $timeout.cancel(layoutTimeout);
                    $timeout.cancel(gifTimeout);
                    if (angular.isDefined(soundcloudPlayer)) {
                        soundcloudPlayer.then(function(sound) {
                            sound.stop();
                        });
                        soundcloudPlayer = null;
                    }
                    $interval.cancel(progressionTracker);
                    Player.setCurrentPosition(0);
                    scope.soundcloudArtwork = undefined;
                }

                function pause() {
                    Player.setStatus('pause');
                        $timeout.cancel(layoutTimeout);
                        $timeout.cancel(gifTimeout);
                    soundcloudPlayer.then(function(sound) {
                        sound.pause();
                        scope.soundcloudArtwork = undefined;
                    });
                }

                function play() {
                    Player.setStatus('playing');
                        function updateGif() {
                            function updateLayout() {
                                $timeout.cancel(layoutTimeout);
                                scope.layout = layouts[Math.floor(Math.random()*layouts.length)];
                                layoutTimeout = $timeout(updateLayout, 3000);
                            }

                            $timeout.cancel(gifTimeout);
                            scope.keyword = giphy_keywords[(giphy_keywords.indexOf(scope.keyword) + 1) % giphy_keywords.length];
                            $http.get(giphy_url + scope.keyword).then(function(data) {
                                var image_url = data.data.data.image_original_url.replace('http://', '//');
                                $('<img>')
                                .attr('src', image_url)
                                .on('load', function() {
                                    scope.soundcloudArtwork = image_url;
                                    if (Player.currentShow.settings && Player.currentShow.settings.dj_layout) {
                                        updateLayout();
                                    }
                                    gifTimeout = $timeout(updateGif, 10000);
                                });
                            });
                        }

                    soundcloudPlayer.then(function(sound) {
                        sound.play();
                        if (!Player.currentShow.settings || (Player.currentShow.settings && Player.currentShow.settings.giphy)) {
                            updateGif();
                        }
                    });
                }

                scope.$watch('soundcloudItem', function(n , o) {
                    clear();
                    angular.extend(scope, {
                        background: '/images/recordPlayer.gif'
                    });
                    var soundDeferred = $q.defer();
                    soundcloudPlayer = soundDeferred.promise;
                    SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                    SC.get('/resolve/', {url: Player.currentItem.url}, function(data) {
                        SC.stream(data.uri, function(sound) {
                            play();
                            soundDeferred.resolve(sound);
                            if (Player.isMuted) {
                                mute();
                            }
                            $interval.cancel(progressionTracker);
                            progressionTracker = $interval(function() {
                                Player.setCurrentPosition((sound.getCurrentPosition() /  sound.getDuration()) * 100);
                                if (sound.getCurrentPosition() >  sound.getDuration() - 5){
                                    Player.nextItem();
                                }
                            }, 250);
                        });
                    });
                });
                scope.$on('player.seekTo', function(e, percent) {
                    soundcloudPlayer.then(function(sound) {
                        sound.seek(Math.ceil((percent/100) * sound.getDuration()));
                    });
                });
                scope.$on('player.toggleMute', scope.toggleMute);
                scope.$on('player.playPause', scope.playPause);
                scope.$on('$destroy', function() {
                    clear();
                });
            },
            template: [
                '<div class="soundCloudViz {{ layout }}">',
                    '<div class="background"',
                        'ng-style="{\'background-image\': \'url(\'+background+\')\'}">',
                    '</div>',
                    '<img ng-src="{{soundcloudArtwork}}" ng-if="layout !== \'repeat\'"/>',
                    '<img ng-src="{{soundcloudArtwork}}" ng-if="layout === \'symmetry\'" />',
                    '<div class="repeatable"',
                        'ng-style="{\'background-image\': \'url(\'+soundcloudArtwork+\')\'}"',
                        'ng-if="layout === \'repeat\'">',
                    '</div>',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player').directive('soundcloudViz', SoundcloudVizDirective);

})();
