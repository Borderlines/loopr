(function() {
    'use strict';

    ShowsCtrl.$inject = ['Shows', '$location', 'login', '$rootScope'];
    function ShowsCtrl(Shows, $location, login, $rootScope) {
        var vm = this;
        if (!login.user) {
            return $location.url('/login');
        }
        angular.extend(vm, {
            addToLoopMode: function(show) {
                $rootScope.$broadcast('openAddingShowMode', show);
            }
        });
        Shows.getList({timestamp:Date.now()}).then(function(shows) {
            vm.shows = shows;
        });
    }

    angular.module('loopr').controller('ShowsCtrl', ShowsCtrl);

})();
