(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Loops', 'Shows', 'Accounts', '$stateParams', '$timeout', 'login',
    '$rootScope', '$location', 'hotkeys', '$scope', '$q', 'Fullscreen', 'upperStrip', 'lowerStrip', 'strip'];
    function PlayerCtrl(Player, Loops, Shows, Accounts, $stateParams, $timeout, login,
        $rootScope, $location, hotkeys, $scope, $q, Fullscreen, upperStrip, lowerStrip, strip) {
        var vm = this;
        angular.extend(vm, {
            strip: strip,
            Player: Player
        });
        $rootScope.Player = Player;
        function getLoopFromUrlOrAuthenticatedUser() {
            if (!angular.isDefined($stateParams.username) || $stateParams.username === '' || $stateParams.username === '_=_') {
                return login.login();
            } else {
                return Accounts.one('username/' + $stateParams.username).get();
            }
        }
        // from fb authentification
        getLoopFromUrlOrAuthenticatedUser().then(function(user) {
            var loop = user.loops[0];
            loop.user = user;
            // shuffle ?
            function shuffle(o) {
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            loop.shows_list.forEach(function(show) {
                if (show.settings && show.settings.shuffle) {
                    var item_to_save;
                    if (angular.isDefined($stateParams.item)) {
                        item_to_save = _.find(show.items, function(link) {
                            return link.id === $stateParams.item;
                        });
                    }
                    shuffle(show.items);
                    if (angular.isDefined(item_to_save)) {
                        show.items.splice(0, 0, show.items.splice(show.items.indexOf(item_to_save), 1)[0]);
                    }
                }
            });
            var show = _.find(loop.shows_list, function(show) { return show.id.toString() === $stateParams.show;});
            if (!angular.isDefined(show) && $stateParams.show) {
                show = Shows.one($stateParams.show).get().then(function(show) {
                    loop.shows_list.push(show);
                    return show;
                });
            }
            return $q.when(show).then(function(show) {
                Player.setLoop(loop);
                lowerStrip.addQueries(loop.strip_messages);
                vm.loop = loop;
                var item_index;
                if (show && $stateParams.item) {
                    item_index = _.findIndex(show.items, function(link) {
                        return parseInt($stateParams.item, 10) === parseInt(link.id, 10);
                    });
                }
                Player.playShow(show, item_index);
                return loop;
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
            $location.search({show: show.id, item: item.id});
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
            description: 'next show',
            callback: function(e) {
                vm.Player.nextShow();
                e.preventDefault();
            }
        })
        .add({
            combo: 'left',
            description: 'previous show',
            callback: function(e) {
            vm.Player.previousShow();
                e.preventDefault();
            }
        })
        .add({
            combo: 'up',
            description: 'previous item',
            callback: vm.Player.nextItem
        })
        .add({
            combo: 'down',
            description: 'next item',
            callback: vm.Player.previousItem
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
                    element.css('cursor', 'none');
                }
                function showCursor() {
                    element.css('cursor', '');
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
