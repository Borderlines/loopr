(function() {
'use strict';

ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show'];
function ShowExplorerCtrl(Player, scope, stripService, show) {
    var vm = this;
    angular.extend(vm, {
        stripService: stripService,
        show: show,
        playingNow: Player.currentShow === show,
        player: Player
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
