(function() {
    'use strict';
    SoundcloudVizDirective.$inject = ['Player', '$interval', 'Restangular', '$timeout'];
    function SoundcloudVizDirective(Player, $interval, Restangular, $timeout) {
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

                function clear() {
                    $timeout.cancel(layoutTimeout);
                    $timeout.cancel(gifTimeout);
                    if (angular.isDefined(soundcloudPlayer)) {
                        soundcloudPlayer.stop();
                    }
                    $interval.cancel(progressionTracker);
                    Player.setCurrentPosition(0);
                    scope.soundcloudArtwork = undefined;
                    scope.soundcloudIllustration = undefined;
                }

                scope.$watch('soundcloudItem', function(n , o) {
                    clear();
                    SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                    SC.get('/resolve/', {url: Player.currentItem.url}, function(data) {
                        function updateGif() {
                            $timeout.cancel(gifTimeout);
                            var giphy_url = '//api.giphy.com/v1/gifs/random?rating=r&api_key=dc6zaTOxFJmzC&tag=';
                            var giphy_keywords = ['dance'];
                            Restangular.oneUrl('giphy', giphy_url + giphy_keywords.join('+')).get().then(function(data) {
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

                        function updateLayout() {
                            $timeout.cancel(layoutTimeout);
                            scope.layout = layouts[(layouts.indexOf(scope.layout) + 1) % layouts.length];
                            layoutTimeout = $timeout(updateLayout, 5000);
                        }

                        updateGif();
                        angular.extend(scope, {
                            soundcloudIllustration: data.waveform_url
                        });
                        SC.stream('/tracks/' + data.id, function(sound) {
                            soundcloudPlayer = sound;
                            soundcloudPlayer.play();
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
                '<div class="soundCloudViz {{ layout }}"',
                'ng-style="{\'background-image\': \'url(\'+soundcloudIllustration+\')\'}">',
                    '<img src="{{soundcloudArtwork}}"/>',
                    '<img src="{{soundcloudArtwork}}" ng-if="layout === \'symmetry\'" />',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player').directive('soundcloudViz', SoundcloudVizDirective);

})();
