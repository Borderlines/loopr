(function() {
'use strict';

StripHeaderCtrl.$inject = ['strip', 'login', 'Player'];
function StripHeaderCtrl(strip, login, Player) {
    var vm = this;
    angular.extend(vm, {
        loopAuthor: Player.loop.user.username,
        showsCount: Player.loop.user.loops[0].shows_list.length,
        currentUser: login.currentUser
    });
}

angular.module('loopr.stripHeader', [])
.controller('StripHeaderCtrl', StripHeaderCtrl)
.directive('l8prStripHeader', [function() {
    return {
            scope: {},
            templateUrl: '/static/strip/header/template.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: StripHeaderCtrl
    };
}]);

})();
