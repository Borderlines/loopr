(function() {
    'use strict';
    angular.module('loopr.player').directive('looprGiphy',
    ['Player', '$timeout', '$http',
    function(Player, $timeout, $http) {
        return {
            restrict: 'E',
            template: [
               '<div class="loopr-giphy {{ layout }}">',
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
           ].join(''),
           link: function(scope, elmt) {
                var gifTimeout;
                var layoutTimeout;
                var layouts = ['default', 'symmetry', 'repeat'];
                var giphy_keywords = Player.currentShow.settings &&
                                     Player.currentShow.settings.giphy_tags &&
                                     Player.currentShow.settings.giphy_tags.split(',') || [];
                var giphy_url = '//api.giphy.com/v1/gifs/random?rating=r&api_key=dc6zaTOxFJmzC&tag=';
                angular.extend(scope, {
                    background: '/static/images/recordPlayer.gif'
                });
                function updateGif() {
                    function updateLayout() {
                        $timeout.cancel(layoutTimeout);
                        scope.layout = layouts[Math.floor(Math.random()*layouts.length)];
                        layoutTimeout = $timeout(updateLayout, 3000, false);
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
                            gifTimeout = $timeout(updateGif, 10000, false);
                            this.remove();
                        });
                    });
                }
                updateGif();
            }
        };
    }]);
})();
