import * as playerAction from './actions';
import {showSelector, itemSelector} from './selectors';
(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', '$timeout','login', 'addToShowModal', 'Api', '$ngRedux', 'progression', '$interval',
    '$rootScope', 'hotkeys', '$scope', '$q', 'Fullscreen', 'upperStrip', 'lowerStrip', 'strip', '$state', 'strip', 'help'];
    function PlayerCtrl(Player, $timeout, login, addToShowModal, Api, $ngRedux, progression, $interval,
        $rootScope, hotkeys, $scope, $q, Fullscreen, upperStrip, lowerStrip, strip, $state, stripService, help) {
        var vm = this;
        const mapStateToTarget = (state) => ({
            router: state.router,
            player: state.player,
            strip: state.strip,
            currentShow: showSelector(state.player),
            currentItem: itemSelector(state.player)
        })
        let disconnect = $ngRedux.connect(mapStateToTarget, playerAction)(vm);
        const {username, show, item} = vm.router.currentParams;
        Player.loadLoop(username).then(function(loop) {
            vm.setLoop(loop.shows_list);
            vm.playItem(show, item);
        });
        $scope.$on('$destroy', disconnect);
        angular.extend(vm, {
            strip: strip,
            Player: Player,
            progression: 0,
            showsCount: 0,
            currentUser: login.currentUser,
            addToShowModal: addToShowModal,
            upperStrip: upperStrip,
            lowerStrip: lowerStrip,
            stripService: stripService,
            help: function() {
                    help.open();
            },
            isExtented: function() {
                return !_.contains(['index', 'resetPassword'], $state.current.name);
            },
            // setPosition: $event =>  progression.setPosition(($event.offsetX / $event.currentTarget.offsetWidth) * 100),
            isFullScreen: Fullscreen.isEnabled,
            // toggleFullscreen: function() {
            //     if (Fullscreen.isEnabled()) {
            //         Fullscreen.cancel();
            //     } else {
            //         Fullscreen.all();
            //     }
            // },
            login: login,
            showAndHideStrip: _.throttle(strip.showAndHide, 500)
        });
        // $interval(function() {
        //     vm.progression = progression.getValue();
        // }, 1000);
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
        // setBanner(vm.Player.currentItem, vm.Player.currentShow);
        // $scope.$on('player.play', function ($event, item, show) {
        //     setBanner(item, show);
        // });
        // HOTKEYS
        hotkeys.bindTo($scope)
        .add({
            combo: ['c'],
            description: 'Show the controller',
            callback: () => vm.toogleStrip()
        })
        .add({
            combo: 'm',
            description: 'Mute/Unmute',
            callback: () => {
                if (vm.player.mute) {
                    vm.unmute();
                } else {
                    vm.mute();
                }
            }
        })
        .add({
            combo: 'space',
            description: 'pause/play',
            callback: () => {
                if (vm.player.playing) {
                    vm.pause();
                } else {
                    vm.play();
                }
            }
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
            callback: () => vm.nextShow()
        })
        .add({
            combo: 'left',
            description: 'previous show',
            callback: () => vm.previousShow()
        })
        .add({
            combo: 'up',
            description: 'previous item',
            callback: () => vm.previousItem()
        })
        .add({
            combo: 'down',
            description: 'next item',
            callback: () => vm.nextItem()
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
