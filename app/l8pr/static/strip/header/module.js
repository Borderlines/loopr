(function() {
'use strict';

StripHeaderCtrl.$inject = ['login', 'Player', '$state', '$history'];
function StripHeaderCtrl(login, Player, $state, $history) {
    var vm = this;
    angular.extend(vm, {
        searchQuery: $state.params.q,
        searchBarVisible: $state.current.name === 'index.open.search' || ($state.params.q && $state.params.q !== ''),
        loopAuthor: Player.loop.user.username,
        showsCount: Player.loop.user.loops[0].shows_list.length,
        currentUser: login.currentUser,
        exit: function() {
            vm.clear();
            vm.searchBarVisible = false;
            if ($state.current.name === 'index.open.search') {
                $history.back();
            }
        },
        clear: function() {
            vm.searchQuery = '';
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
            templateUrl: '/strip/header/template.html',
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
