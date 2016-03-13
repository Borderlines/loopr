(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Loops', 'Shows', 'Accounts', '$routeParams', '$timeout', 'login',
    '$rootScope', '$location', 'hotkeys', '$scope', '$q', 'Fullscreen', 'upperStrip', 'lowerStrip', 'strip'];
    function PlayerCtrl(Player, Loops, Shows, Accounts, $routeParams, $timeout, login,
        $rootScope, $location, hotkeys, $scope, $q, Fullscreen, upperStrip, lowerStrip, strip) {
        var vm = this;
        angular.extend(vm, {
            strip: strip,
            Player: Player
        });
        $rootScope.Player = Player;
        function getLoopFromUrlOrAuthenticatedUser() {
            if ($routeParams.username === '_=_') {
                return login.login();
            } else {
                return Accounts.one('username/' + $routeParams.username).get();
            }
        }
        // from fb authentification
        getLoopFromUrlOrAuthenticatedUser().then(function(user) {
            return Loops.getList({user: user.id}).then(function(loop) {
                loop = loop[0];
                loop.user = user;
                // shuffle ?
                function shuffle(o) {
                    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                    return o;
                }
                loop.shows_list.forEach(function(show) {
                    if (show.settings && show.settings.shuffle) {
                        var item_to_save;
                        if (angular.isDefined($routeParams.item)) {
                            item_to_save = _.find(show.items, function(link) {
                                return link.uuid === $routeParams.item;
                            });
                        }
                        shuffle(show.items);
                        if (angular.isDefined(item_to_save)) {
                            show.items.splice(0, 0, show.items.splice(show.items.indexOf(item_to_save), 1)[0]);
                        }
                    }
                });
                var show = _.find(loop.shows_list, function(show) { return show._id === $routeParams.show;});
                if (!angular.isDefined(show) && $routeParams.show) {
                    show = Shows.one($routeParams.show).get().then(function(show) {
                        loop.shows_list.push(show);
                        return show;
                    });
                }
                return $q.when(show).then(function(show) {
                    Player.setLoop(loop);
                    lowerStrip.addQueries(loop.strip_messages);
                    vm.loop = loop;
                    var item_index;
                    if (show && $routeParams.item) {
                        item_index = _.findIndex(show.items, function(link) {
                            return $routeParams.item === link.uuid;
                        });
                    }
                    Player.playShow(show, item_index);
                    return loop;
                });
            });
        });
        $scope.showAndHideStrip = _.throttle(strip.showAndHide, 500);
        $scope.$on('player.play', function ($event, item, show) {
            var lines = [item.title,
                        ['Show', '<b>'+show.title+'</b>', 'by', vm.loop.user.username].join(' ')];
            if (item.subtitle) {
                lines.push(item.subtitle);
            }
            lines.push(item.title);
            upperStrip.setBanner(lines);
            // show strip
            if (strip.isAutoHideEnabled) {
                strip.showAndHide();
            }
            // deep linking
            $location.search({show: show._id, item: item.uuid});
        });
        // HOTKEYS
        hotkeys.bindTo($scope)
        .add({
            combo: ['ctrl', 'c'],
            description: 'Show the controller',
            callback: strip.toggleController
        })
        .add({
            combo: 'm',
            description: 'Mute/Unmute',
            callback: vm.Player.toggleMute
        })
        .add({
            combo: 'space',
            description: 'pause/play',
            callback: vm.Player.playPause
        })
        .add({
            combo: 'f',
            description: 'Full screen',
            callback: function() {
                if (Fullscreen.isEnabled()) {
                    Fullscreen.cancel();
                } else {
                    Fullscreen.all();
                }
            }
        })
        .add({
            combo: 'right',
            description: 'next item',
            callback: vm.Player.nextItem
        })
        .add({
            combo: 'left',
            description: 'previous item',
            callback: vm.Player.previousItem
        })
        .add({
            combo: 'up',
            description: 'next show',
            callback: vm.Player.nextShow
        })
        .add({
            combo: 'down',
            description: 'previous show',
            callback: vm.Player.previousShow
        });
}

    angular.module('loopr.player')
    .controller('PlayerCtrl', PlayerCtrl)
    .directive('autoHideCursor', ['$timeout', function($timeout) {
        return {
            scope: true,
            link: function(scope, element) {
                var hideCursorTimeout;
                function hideCursor() {
                    angular.element('body').css('cursor', 'none');
                }
                function showCursor() {
                    angular.element('body').css('cursor', '');
                }
                $timeout(hideCursor, 3000);
                element.on('mouseout', function() {
                    $timeout.cancel(hideCursorTimeout);
                    showCursor();
                });
                element.on('mousemove', function() {
                    $timeout.cancel(hideCursorTimeout);
                    showCursor();
                    hideCursorTimeout = $timeout(hideCursor, 3000);
                });
            }
        };
    }]);

})();
