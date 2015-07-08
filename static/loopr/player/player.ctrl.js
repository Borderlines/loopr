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
            playShow: function(show, index) {
                if (!angular.isDefined(show)) {

                    var now = new Date(),
                    then = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        0,0,0),
                    diff = (now.getTime() - then.getTime()) / 1000;
                    var watch_at = diff % vm.loop.duration();
                    var spent = 0;
                    for (var i = 0; i < vm.loop.shows.length; i++) {
                        if (angular.isDefined(index)) {
                            break;
                        }
                        show = vm.loop.shows[i];
                        if (spent < watch_at) {
                            if (spent + show.duration() < watch_at) {
                                spent += show.duration();
                            } else {
                                for (var j = 0; j < show.links.length; j++) {
                                    var link = show.links[j];
                                    if (spent + link.duration < watch_at) {
                                        spent += link.duration;
                                    } else {
                                        index = j;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                index = index || 0;
                vm.currentShow = show;
                vm.currentItem = show.links[index];
                if (show.type === 'VideoShow') {
                    vm.playVideoShow(show, index);
                }
            },
            playVideoShow: function(show, index) {
                vm.youtubeUrl = show.links[index].url;
            },
            nextItem: function() {
                var current_item_index = vm.currentShow.links.indexOf(vm.currentItem);
                if (vm.currentShow.links.length - 1 > current_item_index) {
                    // next item
                    vm.playShow(vm.currentShow, current_item_index + 1);
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
                vm.playShow();
            });
        });
        $rootScope.$on('youtube.player.error', function ($event, player) {
            vm.nextItem();
        });
        $rootScope.$on('youtube.player.ended', function ($event, player) {
            vm.nextItem();
        });

    }

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
