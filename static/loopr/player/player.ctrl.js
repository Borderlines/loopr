(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Shows', 'Loops', 'Accounts', '$routeParams', '$rootScope'];
    function PlayerCtrl(Player, Shows, Loops, Accounts, $routeParams, $rootScope) {
        var vm = this;
        angular.extend(vm, {
            currentShow: {},
            user: {},
            loop: {},
            youtubeConfig: {
                controls: 0,
                autoplay: 1,
                showinfo: 0,
                wmode: 'opaque'
            }
        });
        Accounts.one($routeParams.username).get().then(function(user) {
            Loops.getList({where: {user_id: user._id}, embedded:{shows:1}}).then(function(loop) {
                vm.loop = loop[0];
                Player.setLoop(loop[0]);
                Player.playShow();
            });
        });
        $rootScope.$on('youtube.player.error', function ($event, player) {
            Player.nextItem();
        });
        $rootScope.$on('youtube.player.ended', function ($event, player) {
            Player.nextItem();
        });
        $rootScope.$on('youtube.player.ready', function ($event, player) {
        });
        $rootScope.$on('player.play', function ($event, item) {
            if (item.provider_name === 'YouTube') {
                vm.youtubeUrl = item.url;
            }
        });
    }

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
