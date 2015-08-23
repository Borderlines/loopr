(function() {
    'use strict';
    SoundcloudVizDirective.$inject = ['Player'];
    function SoundcloudVizDirective(Player) {
        return {
            scope: {
                soundcloudItem: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var soundcloudPlayer;
                scope.$watch('soundcloudItem', function(n , o) {
                    if (angular.isDefined(soundcloudPlayer)) {
                        soundcloudPlayer.stop();
                    }
                    SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                    SC.get('/resolve/', {url: Player.currentItem.url}, function(data) {
                        scope.soundcloudArtwork = data.artwork_url.replace('large', 't500x500');
                        scope.soundcloudIllustration = data.waveform_url;
                        SC.stream('/tracks/' + data.id, function(sound){
                            soundcloudPlayer = sound;
                            soundcloudPlayer.play();
                            // Player.setCurrentPosition()
                            // trackProgression(sound.getCurrentPosition.bind(sound), sound.getDuration.bind(sound));
                        });
                    });
                });
                scope.$on('$destroy', function() {
                    if (angular.isDefined(soundcloudPlayer)) {
                        soundcloudPlayer.stop();
                    }
                });
            },
            template: [
                '<div class="soundCloudViz"',
                'ng-style="{\'background-image\': \'url(\'+soundcloudIllustration+\')\'}">',
                    '<img ng-src="{{soundcloudArtwork}}"/>',
                '</div>'
            ].join('')
        };
    }
    angular.module('loopr.player').directive('soundcloudViz', SoundcloudVizDirective);

})();
