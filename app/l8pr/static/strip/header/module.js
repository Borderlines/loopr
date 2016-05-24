(function() {
'use strict';

StripHeaderCtrl.$inject = ['strip', 'login', 'Player', '$state', '$stateParams'];
function StripHeaderCtrl(strip, login, Player, $state, $stateParams) {
    var vm = this;
    angular.extend(vm, {
        searchQuery: $stateParams.q,
        searchBarVisible: vm.searchQuery !== '',
        loopAuthor: Player.loop.user.username,
        showsCount: Player.loop.user.loops[0].shows_list.length,
        currentUser: login.currentUser,
        clear: function() {
            vm.searchQuery = '';
            $state.go('index.open.search', {q: ''});
        },
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
}])
.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].focus();
                }
            });
        }
    };
});

})();
