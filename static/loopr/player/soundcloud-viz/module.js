(function() {
    'use strict';
    SoundcloudVizDirective.$inject = ['Player', '$interval', 'Restangular', '$timeout', '$q'];
    function SoundcloudVizDirective(Player, $interval, Restangular, $timeout, $q) {
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
                var layouts = ['default', 'symmetry'];
                var giphy_keywords = Player.currentShow.settings && Player.currentShow.settings.giphyTags.split(',') || [];
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
                        $timeout.cancel(layoutTimeout);
                        $timeout.cancel(gifTimeout);
                    soundcloudPlayer.then(function(sound) {
                        sound.pause();
                        scope.soundcloudArtwork = undefined;
                    });
                }
                function play() {
                        function updateGif() {
                            function updateLayout() {
                                $timeout.cancel(layoutTimeout);
                                scope.layout = layouts[(layouts.indexOf(scope.layout) + 1) % layouts.length];
                                layoutTimeout = $timeout(updateLayout, 5000);
                            }

                            $timeout.cancel(gifTimeout);
                            scope.keyword = giphy_keywords[(giphy_keywords.indexOf(scope.keyword) + 1) % giphy_keywords.length];
                            Restangular.oneUrl('giphy', giphy_url + scope.keyword).get().then(function(data) {
                                var image_url = data.data.image_original_url.replace('http://', '//');
                                $('<img>')
                                .attr('src', image_url)
                                .on('load', function() {
                                    scope.soundcloudArtwork = image_url;
                                    updateLayout();
                                    gifTimeout = $timeout(updateGif, 10000);
                                });
                            });
                        }

                    soundcloudPlayer.then(function(sound) {
                        sound.play();
                        updateGif();
                    });
                }

                scope.$watch('soundcloudItem', function(n , o) {
                    clear();
                    var soundDeferred = $q.defer();
                    soundcloudPlayer = soundDeferred.promise;
                    SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                    SC.get('/resolve/', {url: Player.currentItem.url}, function(data) {
                        angular.extend(scope, {
                            background: '/static/logos/L8pr-' + (Math.ceil(Math.random()*6) + 1) + '-500.gif'
                        });
                        SC.stream(data.uri, function(sound) {
                            play();
                            soundDeferred.resolve(sound);
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
                scope.$on('$destroy', function() {
                    clear();
                });
            },
            template: [
                '<div class="soundCloudViz {{ layout }}">',
                    '<div class="background"',
                        'ng-style="{\'background-image\': \'url(\'+background+\')\'}">',
                    '</div>',
                    '<img ng-src="{{soundcloudArtwork}}"/>',
                    '<img ng-src="{{soundcloudArtwork}}" ng-if="layout === \'symmetry\'" />',
                    '<div class="overlay" ng-click="playPause()"></div>"',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player').directive('soundcloudViz', SoundcloudVizDirective);

})();
