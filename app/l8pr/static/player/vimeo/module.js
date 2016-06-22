(function() {
    'use strict';
    VimeoDirective.$inject = ['Player', '$interval', '$rootScope'];
    function VimeoDirective(Player, $interval, $rootScope) {
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
                    plyrPlayer.embed.api('getDuration', function(duration) {
                        plyrPlayer.seek((percent/100) * duration);
                    });
                });
                scope.$watch('item', function() {
                    var url = scope.item.url.split('/');
                    try {
                        plyrPlayer.source({
                            type: 'video',
                            sources: [{
                                src: url[url.length - 1],
                                type: 'vimeo'
                            }]
                        });
                    // returns an error from a missing button.
                    } catch (e) {}
                });
                var playerEvents = {
                    error: function(event) {
                        Player.setCurrentPosition(0);
                        Player.nextItem();
                    },
                    playing: function(event) {
                        Player.setStatus('playing');
                        plyrPlayer.setVolume((Player.isMuted) ? 0 : 100);
                        plyrPlayer.embed.addEvent('playProgress', function(data) {
                            Player.setCurrentPosition(data.percent * 100);
                        });
                    },
                    pause: function(event) {
                        Player.setStatus('pause');
                    },
                    ended: function(event) {
                        Player.setCurrentPosition(0);
                        Player.nextItem();
                    }
                };
                angular.forEach(playerEvents, function(eventHandler, eventName) {
                    element.get(0).addEventListener(eventName, eventHandler);
                });
                scope.$on('$destroy', function() {
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
    angular.module('loopr.player.vimeo', []).directive('vimeo', VimeoDirective);

})();
