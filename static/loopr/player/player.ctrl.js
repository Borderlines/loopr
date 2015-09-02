(function() {
    'use strict';

    PlayerCtrl.$inject = ['Player', 'Loops', 'Shows', 'Accounts', '$routeParams',
    '$rootScope', '$location', 'hotkeys', '$scope', '$q'];
    function PlayerCtrl(Player, Loops, Shows, Accounts, $routeParams,
        $rootScope, $location, hotkeys, $scope, $q) {
        var vm = this;
        angular.extend(vm, {
            lines: undefined,
            Player: Player
        });
        $rootScope.Player = Player;
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
                var show = _.find(loop.shows, function(show) { return show._id === $routeParams.show;});
                if (!angular.isDefined(show) && $routeParams.show) {
                    show = Shows.one($routeParams.show).get().then(function(show) {
                        loop.shows.push(show);
                        return show;
                    });
                }
                return $q.when(show).then(function(show) {
                    Player.setLoop(loop);
                    Player.playShow(show, $routeParams.item);
                    vm.loop = loop;
                    return loop;
                });
            });
        });
        $scope.$on('player.play', function ($event, item, show) {
            var lines = [item.title, 'Show ' + '<b>'+show.title+'</b>'];
            if (item.subtitle) {
                lines.push(item.subtitle);
            }
            lines.push(item.title);
            vm.lines = lines;
            // deep linking
            $location.search({show: show._id, item:show.links.indexOf(item)});
        });
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
        })
        .add({
            combo: 'c',
            description: 'Show the controller',
            callback: function() {
                vm.showController = !vm.showController;
            }
        });
}

    angular.module('loopr.player').controller('PlayerCtrl', PlayerCtrl);

})();
