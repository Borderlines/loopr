(function() {
'use strict';

ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show', 'showConfig',
'addToShowModal', 'Api', '$state', '$confirm', 'Restangular'];
function ShowExplorerCtrl(Player, scope, stripService, show, showConfig,
addToShowModal, Api, $state, $confirm, Restangular) {
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
                var oldShow = Restangular.copy(show);
                _.remove(oldShow.items, function(i) {
                    // FIXME: item can have no id
                    return item.id === i.id;
                });
                oldShow.items = angular.copy(oldShow.items);
                return oldShow.put().then(function(s) {
                    show.items = s.items;
                });
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
