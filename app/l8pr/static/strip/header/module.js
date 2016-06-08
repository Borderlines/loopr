(function() {
'use strict';

StripHeaderCtrl.$inject = ['login', 'Player', '$state', '$history', 'loop', 'hotkeys', '$rootScope'];
function StripHeaderCtrl(login, Player, $state, $history, loop, hotkeys, $rootScope) {
    var vm = this;
    angular.extend(vm, {
        searchQuery: $state.params.q,
        searchBarVisible: $state.current.name === 'index.open.search' && ($state.params.q === undefined || $state.params.q === ''),
        loopAuthor: loop.username,
        showsCount: loop.shows_list.length,
        loginService: login,
        openLoginView: login.openLoginView,
        exit: function() {
            if ($state.current.name === 'index.open.search') {
                $history.back();
            }
        },
        search: function(query) {
            $state.go('index.open.search', {q: query});
            vm.searchBarVisible = false;
        }
    });
    // login to know the current user
    login.login();
    // listen for key shortcut
    $rootScope.$on('openSearch', function() {
        vm.searchQuery = '';
        vm.searchBarVisible = true;
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
