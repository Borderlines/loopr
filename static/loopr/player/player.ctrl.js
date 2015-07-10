(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Shows', 'Loops', 'Accounts', '$routeParams', '$rootScope', '$interval'];
    function PlayerCtrl(Player, Shows, Loops, Accounts, $routeParams, $rootScope, $interval) {
        var vm = this;
        angular.extend(vm, {
            progressionTracker: undefined,
            progression: 0,
            lines: [],
            // underlines: [],
            Player: Player,
            youtubeConfig: {
                controls: 0,
                autoplay: 1,
                showinfo: 0,
                wmode: 'opaque'
            }
        });
        vm.loop = Accounts.one($routeParams.username).get().then(function(user) {
            return Loops.getList({where: {user_id: user._id}, embedded:{shows:1}}).then(function(loop) {
                Player.setLoop(loop[0]);
                Player.playShow();
                return loop[0];
                // var underlines = [];
                // loop[0].strip_queries.forEach(function(query) {
                //     query.results.forEach(function(tweet) {
                //         underlines.push('@'+tweet.user.name+': '+tweet.text);
                //     });
                // });
                // vm.underlines = underlines;
            });
        });
        $rootScope.$on('youtube.player.error', function() {
            $interval.cancel(vm.progressionTracker);
            vm.progression = 0;
            Player.nextItem();
        });
        $rootScope.$on('youtube.player.ended', function() {
            $interval.cancel(vm.progressionTracker);
            vm.progression = 0;
            Player.nextItem();
        });
        $rootScope.$on('youtube.player.playing', function(e, player) {
            $interval.cancel(vm.progressionTracker);
            vm.progressionTracker = $interval(function() {
                vm.progression = (player.getCurrentTime() / player.getDuration()) * 100;
            }, 250);
        });
        $rootScope.$on('player.play', function ($event, item, show) {
            $interval.cancel(vm.progressionTracker);
            vm.progression = 0;
            vm.lines = [item.title, 'Show ' + '<b>'+show.title+'</b>', item.title];
            if (item.provider_name === 'YouTube') {
                vm.youtubeUrl = item.url;
            }
        });
    }

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
