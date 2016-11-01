import * as actions from '../../player/actions';

YoutubeDirective.$inject = ['Player', '$interval', '$rootScope', '$ngRedux', 'progression'];
function YoutubeDirective(Player, $interval, $rootScope, $ngRedux, progression) {
    return {
        scope: {
            item: '='
        },
        restrict: 'E',
        link: function(scope, element) {
            const mapStateToTarget = (state, s) => ({
                player: state.player,
            })
            let disconnect = $ngRedux.connect(mapStateToTarget, actions)(scope);
            scope.$on('$destroy', disconnect);
            var plyrPlayer = window.plyr.setup(element.get(0), {
                autoplay: true, controls: []
            })[0];
            scope.$watch('player.playing', (playing) => {
                if (playing) {
                    plyrPlayer.play()
                } else {
                    plyrPlayer.pause()
                }
            })
            scope.$watch('player.mute', (mute) => {
                try {
                    plyrPlayer.setVolume((mute) ? 0 : 100);
                } catch (e) {}
            })
            scope.$on('player.seekTo', function(e, percent) {
                plyrPlayer.seek((percent/100) * plyrPlayer.embed.getDuration());
            });
            scope.$watch('item', function() {
                try {
                    plyrPlayer.source({
                        type: 'video',
                        sources: [{
                            src: getYoutubeId(scope.item.url),
                            type: 'youtube'
                        }]
                    });
                // returns an error from a missing button.
                } catch (e) {}
            });
            function getYoutubeId(url) {
                var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                var match = url.match(regExp);
                return (match && match[7].length === 11)? match[7] : false;
            }
            var playerEvents = {
                error: function(event) {
                    scope.nextItem();
                },
                playing: function(event) {
                    plyrPlayer.setVolume((scope.player.mute) ? 0 : 100);
                    progression.bindProgression(() => {
                        return (plyrPlayer.embed.getCurrentTime() / plyrPlayer.embed.getDuration()) * 100
                    })
                },
                pause: function(event) {
                },
                ended: function(event) {
                    scope.nextItem();
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
angular.module('loopr.player.youtube', []).directive('youtube', YoutubeDirective);
