(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', '$stateParams', '$timeout','login', 'loop', 'addToShowModal', 'Api',
    '$rootScope', 'hotkeys', '$scope', '$q', 'Fullscreen', 'upperStrip', 'lowerStrip', 'strip', '$state', 'strip', 'help'];
    function PlayerCtrl(Player, $stateParams, $timeout, login, loop, addToShowModal, Api,
        $rootScope, hotkeys, $scope, $q, Fullscreen, upperStrip, lowerStrip, strip, $state, stripService, help) {
        var vm = this;
        angular.extend(vm, {
            $state: $state,
            strip: strip,
            Player: Player,
            showsCount: 0,
            currentUser: login.currentUser,
            addToShowModal: addToShowModal,
            upperStrip: upperStrip,
            lowerStrip: lowerStrip,
            stripService: stripService,
            previousShow: Player.previousShow,
            previousItem: Player.previousItem,
            nextItem: Player.nextItem,
            nextShow: Player.nextShow,
            playPause: Player.playPause,
            help: function() {
                    console.log('coucou');
                    help.open();
            },
            isExtented: function() {
                return !_.contains(['index', 'resetPassword'], vm.$state.current.name);
            },
            setPosition: function($event) {
                return Player.setPosition(($event.offsetX / $event.currentTarget.offsetWidth) * 100);
            },
            isFullScreen: Fullscreen.isEnabled,
            toggleFullscreen: function() {
                if (Fullscreen.isEnabled()) {
                    Fullscreen.cancel();
                } else {
                    Fullscreen.all();
                }
            },
            login: login,
            showAndHideStrip: _.throttle(strip.showAndHide, 500)
        });
        function setBanner(item, show) {
            var lines = [item.title];
            if (show) {
                lines.push(['Show', '<b>'+show.title+'</b>', 'by', loop.username].join(' '));
            }
            if (item.subtitle) {
                lines.push(item.subtitle);
            }
            lines.push(item.title);
            upperStrip.setBanner(lines);
            // show strip
            if (strip.isAutoHideEnabled) {
                strip.showAndHide();
            }
        }
        setBanner(vm.Player.currentItem, vm.Player.currentShow);
        $scope.$on('player.play', function ($event, item, show) {
            setBanner(item, show);
        });
        // HOTKEYS
        hotkeys.bindTo($scope)
        .add({
            combo: ['c'],
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
            callback: vm.Player.previousItem
        })
        .add({
            combo: 'down',
            description: 'next item',
            callback: vm.Player.nextItem
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
                $timeout(hideCursor, 3000, false);
                element.on('mouseout', function() {
                    $timeout.cancel(hideCursorTimeout);
                    showCursor();
                });
                element.on('mousemove', function() {
                    $timeout.cancel(hideCursorTimeout);
                    showCursor();
                    hideCursorTimeout = $timeout(hideCursor, 3000, false);
                });
            }
        };
    }]);
})();
