(function() {
'use strict';

StripHeaderCtrl.$inject = ['strip', 'login', 'Player', '$state'];
function StripHeaderCtrl(strip, login, Player,$state) {
    var vm = this;
    angular.extend(vm, {
        loopAuthor: Player.loop.user.username,
        showsCount: Player.loop.user.loops[0].shows_list.length,
        currentUser: login.currentUser,
        search: function(query) {
            $state.go('index.open.search', {q: query});
        }
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
