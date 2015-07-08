(function() {
    'use strict';

    PlayerCtrl.$inject = ['Shows', 'Loops', 'Accounts', '$location', '$routeParams', '$rootScope'];
    function PlayerCtrl(Shows, Loops, Accounts, $location, $routeParams, $rootScope) {
        var vm = this;

        angular.extend(vm, {
            currentShow: {},
            user: {},
            loop: {},
            youtubeConfig: {
                // controls: 0,
                autoplay: 1,
                showinfo: 0
            },
            playShow: function(show) {
                vm.currentShow = show;
                if (show.type === 'VideoShow') {
                    vm.playVideoShow(show);
                }
            },
            playVideoShow: function(show, index) {
                index = index || 0;
                vm.currentItem = show.links[index];
                vm.youtubeUrl = vm.currentItem.url;
            },
            nextInVideoShow: function() {
                var current_item_index = vm.currentShow.links.indexOf(vm.currentItem);
                if (vm.currentShow.links.length - 1 > current_item_index) {
                    // next item
                    vm.playVideoShow(vm.currentShow, current_item_index + 1);
                } else {
                    // next show
                    vm.nextShow();
                }
            },
            nextShow: function() {
                var current_index = vm.loop.shows.indexOf(vm.currentShow);
                var next_show = 0;
                if (current_index > -1 && current_index + 1 < vm.loop.shows.length) {
                    next_show = current_index + 1;
                }
                return vm.playShow(vm.loop.shows[next_show]);
            },
            previous: function() {

            }
        });
        Accounts.one($routeParams.username).get().then(function(user) {
            Loops.getList({where: {user_id: user._id}, embedded:{shows:1}}).then(function(loop) {
                vm.loop = loop[0];
                vm.playShow(vm.loop.shows[0]);
            });
        });
        $rootScope.$on('youtube.player.error', function ($event, player) {
            vm.nextInVideoShow();
        });
        $rootScope.$on('youtube.player.ended', function ($event, player) {
            vm.nextInVideoShow();
        });

    }

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
