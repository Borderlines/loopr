(function() {
    'use strict';

    EditStripCtrl.$inject = ['Shows', '$location', 'login', '$rootScope'];
    function EditStripCtrl(Shows, $location, login, $rootScope) {
        var vm = this;
        if (!login.user) {
            return $location.url('/login');
        }
        angular.extend(vm, {
        })
    }

    angular.module('loopr').controller('EditStripCtrl', EditStripCtrl);

})();
