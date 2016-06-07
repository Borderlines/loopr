(function() {
'use strict';

ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show', 'showConfig'];
function ShowExplorerCtrl(Player, scope, stripService, show, showConfig) {
    var vm = this;
    angular.extend(vm, {
        stripService: stripService,
        show: show,
        playingNow: Player.currentShow === show,
        player: Player,
        showConfig: function() {
            showConfig(show);
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
