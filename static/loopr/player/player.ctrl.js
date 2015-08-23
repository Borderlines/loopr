(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Loops', 'Accounts', '$routeParams', '$rootScope', '$interval', '$location', 'hotkeys', '$scope'];
    function PlayerCtrl(Player, Loops, Accounts, $routeParams, $rootScope, $interval, $location, hotkeys, $scope) {
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
        $rootScope.Player = vm.Player;
        Accounts.one($routeParams.username).get().then(function(user) {
            return Loops.getList({where: {user_id: user._id}, embedded:{shows:1}}).then(function(loop) {
                loop = loop[0];
                // shuffle ?
                function shuffle(o) {
                    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                    return o;
                }
                loop.shows.forEach(function(show) {
                    if (show.settings && show.settings.shuffle) {
                        var item_to_save;
                        if (angular.isDefined($routeParams.item)) {
                            item_to_save = show.links[$routeParams.item];
                        }
                        shuffle(show.links);
                        if (angular.isDefined(item_to_save)) {
                            show.links.splice($routeParams.item, 0, show.links.splice(show.links.indexOf(item_to_save), 1)[0]);
                        }
                    }
                });
                Player.setLoop(loop);
                var show = _.find(loop.shows, function(show) { return show._id === $routeParams.show;});
                Player.playShow(show, $routeParams.item);
                vm.loop = loop;
                return loop;
            });
        });
        $rootScope.$on('player.play', function ($event, item, show) {
            $interval.cancel(vm.progressionTracker);
            vm.progression = 0;
            var lines = [item.title, 'Show ' + '<b>'+show.title+'</b>'];
            if (item.subtitle) {
                lines.push(item.subtitle);
            }
            lines.push(item.title);
            vm.lines = lines;
            // clean
            if (angular.isDefined(vm.soundCloudPlayer)) {
                vm.soundCloudPlayer.stop();
                vm.soundCloudPlayer = undefined;
            }
            vm.youtubeUrl = undefined;
            if (item.provider_name === 'YouTube') {
                vm.youtubeUrl = item.url;
            } else if (item.provider_name === 'SoundCloud') {
                SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                SC.get('/resolve/', {url: item.url}, function(data) {
                    vm.soundCloudArtwork = data.artwork_url.replace('large', 't500x500');
                    vm.soundCloudIllustration = data.waveform_url;
                    SC.stream('/tracks/' + data.id, function(sound){
                        if (angular.isDefined(vm.soundCloudPlayer)) {
                            vm.soundCloudPlayer.stop();
                        }
                        vm.soundCloudPlayer = sound;
                        sound.play();
                        trackProgression(sound.getCurrentPosition.bind(sound), sound.getDuration.bind(sound));
                    });
                });
            }
            // set the logo
            var logos = {
                Youtube: 'fa-youtube-square',
                SoundCloud: 'fa-soundcloud'
            }
            vm.logo = logos[item.provider_name];
            // deep linking
            $location.search({show: show._id, item:show.links.indexOf(item)});
        });
        // YOUTUBE
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
            trackProgression(player.getCurrentTime.bind(player), player.getDuration.bind(player));
        });
        function trackProgression(current, total) {
            $interval.cancel(vm.progressionTracker);
            vm.progressionTracker = $interval(function() {
                vm.progression = (current() / total()) * 100;
            }, 250);
        }
        // HOTKEYS
        hotkeys.bindTo($scope)
        .add({
            combo: 'right',
            description: 'next item',
            callback: vm.Player.nextItem
        })
        .add({
            combo: 'left',
            description: 'previous item',
            callback: vm.Player.previousItem
        })
        .add({
            combo: 'up',
            description: 'next show',
            callback: vm.Player.nextShow
        })
        .add({
            combo: 'down',
            description: 'previous show',
            callback: vm.Player.previousShow
        });
}

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
