(function() {
    'use strict';

    function SoundcloudVizDirective() {
        return {
            scope: {
                soundcloudIllustration: '=',
                soundcloudArtwork: '='
            },
            restrict: 'E',
            link: function(scope, element) {
                console.log(scope, element);
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
