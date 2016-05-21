(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Shows', 'Accounts', '$stateParams', '$timeout', 'login', 'loopAuthor', 'addToShowModal',
    '$rootScope', 'hotkeys', '$scope', '$q', 'Fullscreen', 'upperStrip', 'lowerStrip', 'strip', '$state', 'strip'];
    function PlayerCtrl(Player, Shows, Accounts, $stateParams, $timeout, login, loopAuthor, addToShowModal,
        $rootScope, hotkeys, $scope, $q, Fullscreen, upperStrip, lowerStrip, strip, $state, stripService) {
        var vm = this;
        angular.extend(vm, {
            $state: $state,
            strip: strip,
            Player: Player,
            loopAuthor: loopAuthor,
            showsCount: 0,
            currentUser: login.currentUser,
            upperStrip: upperStrip,
            lowerStrip: lowerStrip,
            stripService: stripService,
            previousShow: Player.previousShow,
            previousItem: Player.previousItem,
            nextItem: Player.nextItem,
            nextShow: Player.nextShow,
            playPause: Player.playPause,
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
                lines.push(['Show', '<b>'+show.title+'</b>', 'by', vm.loopAuthor.username].join(' '));
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
        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
            // FIXME
            if (toState.name === fromState.name && toParams.q === fromParams.q) {
                event.preventDefault();
            }

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
    // .directive('addToFavorite', [function() {
    //     return {
    //         template: ['<span class="add-to-favs" ng-class="{\'active\': vm.inFavorites}"',
    //                    ' ng-click="vm.addToFavs(); $event.stopPropagation();">',
    //                    '<i class="fa fa-star"></i></span>'].join(''),
    //         scope: {
    //             user: '='
    //         },
    //         controllerAs: 'vm',
    //         controller: ['login', '$scope', function(login, $scope) {
    //             var vm = this;
    //             angular.extend(vm, {
    //                 inFavorites: undefined,
    //                 addToFavs: function() {
    //                     login.login().then(function(user) {
    //                         user.favorites = user.favorites || [];
    //                         var to_fav = $scope.user;
    //                         // add
    //                         if (user.favorites.indexOf(to_fav) === -1) {
    //                             user.favorites.push(to_fav);
    //                             user.patch(_.pick(user, 'favorites'));
    //                             vm.inFavorites = true;
    //                         // remove
    //                         } else {
    //                             user.favorites.splice(user.favorites.indexOf(to_fav), 1);
    //                             user.patch(_.pick(user, 'favorites'));
    //                             vm.inFavorites = false;
    //                         }
    //                     });
    //                 }
    //             });
    //         }]
    //     };
    // }]);

})();
