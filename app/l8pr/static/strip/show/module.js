(function() {
'use strict';

ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show', 'showConfig',
'addToShowModal', 'Api', '$state', '$confirm'];
function ShowExplorerCtrl(Player, scope, stripService, show, showConfig,
addToShowModal, Api, $state, $confirm) {
    var vm = this;
    angular.extend(vm, {
        stripService: stripService,
        show: show,
        playingNow: Player.currentShow === show,
        player: Player,
        showConfig: function() {
            showConfig(show);
        },
        removeItem: function(item) {
            $confirm({text: 'Are you sure you want to delete?'}).then(function() {
                _.remove(show.items, function(i) {
                    return item === i;
                });
                show.put();
            });
        },
        addItemToAShow: addToShowModal
    });
    Api.Accounts.one(show.user).get().then(function(user) {
        vm.user = user;
    });
    scope.$on('l8pr.updatedShow', function(e, updatedShow) {
        if (show.id === updatedShow.id) {
            $state.reload($state.current.name);
        }
    });
    scope.$watch(function() {
        return Player.currentShow;
    }, function(currentShow) {
        vm.playingNow = currentShow === show;
    });
}


angular.module('loopr.strip')
.controller('ShowExplorerCtrl', ShowExplorerCtrl);

})();
