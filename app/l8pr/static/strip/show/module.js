(function() {
'use strict';

ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show', 'showConfig',
'addToShowModal', 'Api', '$state'];
function ShowExplorerCtrl(Player, scope, stripService, show, showConfig,
addToShowModal, Api, $state) {
    var vm = this;
    angular.extend(vm, {
        stripService: stripService,
        show: show,
        playingNow: Player.currentShow === show,
        player: Player,
        showConfig: function() {
            showConfig(show);
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
