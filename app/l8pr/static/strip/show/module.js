(function() {
'use strict';

ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show', 'showConfig', 'addToShowModal', 'Api'];
function ShowExplorerCtrl(Player, scope, stripService, show, showConfig, addToShowModal, Api) {
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
    scope.$watch(function() {
        return Player.currentShow;
    }, function(currentShow) {
        vm.playingNow = currentShow === show;
    });
}


angular.module('loopr.strip')
.controller('ShowExplorerCtrl', ShowExplorerCtrl);

})();
