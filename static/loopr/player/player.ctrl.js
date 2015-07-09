(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Shows', 'Loops', 'Accounts', '$routeParams', '$rootScope', '$interval'];
    function PlayerCtrl(Player, Shows, Loops, Accounts, $routeParams, $rootScope, $interval) {
        var vm = this;
        angular.extend(vm, {
            progressionTracker: undefined,
            progression: 0,
            Player: Player,
            youtubeConfig: {
                controls: 0,
                autoplay: 1,
                showinfo: 0,
                wmode: 'opaque'
            }
        });
        Accounts.one($routeParams.username).get().then(function(user) {
            Loops.getList({where: {user_id: user._id}, embedded:{shows:1}}).then(function(loop) {
                Player.setLoop(loop[0]);
                Player.playShow();
            });
        });
        $rootScope.$on('youtube.player.error', Player.nextItem);
        $rootScope.$on('youtube.player.ended', Player.nextItem);
        $rootScope.$on('youtube.player.playing', function(e, player) {
            vm.progressionTracker = $interval(function() {
                vm.progression = (player.getCurrentTime() / player.getDuration()) * 100;
            }, 250);
        });
        $rootScope.$on('player.play', function ($event, item) {
            $interval.cancel(vm.progressionTracker);
            vm.progression = 0;
            if (item.provider_name === 'YouTube') {
                vm.youtubeUrl = item.url;
            }
        });
    }

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
