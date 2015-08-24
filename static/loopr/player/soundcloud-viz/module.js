(function() {
    'use strict';
    SoundcloudVizDirective.$inject = ['Player', '$interval'];
    function SoundcloudVizDirective(Player, $interval) {
        return {
            scope: {
                soundcloudItem: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var soundcloudPlayer;
                var progressionTracker;

                function clear() {
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
                        angular.extend(scope, {
                            soundcloudArtwork: data.artwork_url.replace('large', 't500x500'),
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
                '<div class="soundCloudViz"',
                'ng-style="{\'background-image\': \'url(\'+soundcloudIllustration+\')\'}">',
                    '<img src="{{soundcloudArtwork}}"/>',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player').directive('soundcloudViz', SoundcloudVizDirective);

})();
