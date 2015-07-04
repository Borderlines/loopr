(function() {
    'use strict';

    ShowsCtrl.$inject = ['Shows', '$location', 'login'];
    function ShowsCtrl(Shows, $location, login) {
        var vm = this;
        if (!login.user) {
            return $location.url('/login');
        }
        angular.extend(vm, {
            openShow: function(show) {
                $location.url('/show/' + show._id);
            }
        })
        Shows.getList({timestamp:Date.now()}).then(function(shows) {
            vm.shows = shows;
        });
    }

    angular.module('loopr').controller('ShowsCtrl', ShowsCtrl);

})();
