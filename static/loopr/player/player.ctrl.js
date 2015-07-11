(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Loops', 'Accounts', '$routeParams', '$rootScope', '$interval', '$location'];
    function PlayerCtrl(Player, Loops, Accounts, $routeParams, $rootScope, $interval, $location) {
        var vm = this;
        angular.extend(vm, {
            progressionTracker: undefined,
            progression: 0,
            lines: undefined,
            Player: Player,
            youtubeConfig: {
                controls: 0,
                autoplay: 1,
                showinfo: 0,
                wmode: 'opaque'
            }
        });
        Accounts.one($routeParams.username).get().then(function(user) {
            return Loops.getList({where: {user_id: user._id}, embedded:{shows:1}}).then(function(loop) {
                Player.setLoop(loop[0]);
                var show = _.find(loop[0].shows, function(show) { return show._id === $routeParams.show;})
                Player.playShow(show, $routeParams.item);
                vm.loop = loop[0];
                return loop[0];
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
            // deep linking
            $location.search({show: show._id, item:show.links.indexOf(item)})
        });
    }

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
