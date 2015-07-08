(function() {
    'use strict';

    EditStripCtrl.$inject = ['Shows', '$location', 'login', '$rootScope'];
    function EditStripCtrl(Shows, $location, login, $rootScope) {
        var vm = this;
        if (!login.user) {
            return $location.url('/login');
        }
        angular.extend(vm, {
            strip: {
                queries: [{
                    accounts: ['@vied12', 'hejorama'],
                    count: 9,
                    filters: ['#mlf', '#japan']
                },{
                    accounts: ['@vied12', 'hejorama'],
                    count: 9,
                    filters: ['#mlf', '#japan']
                },{
                    accounts: ['@vied12', 'hejorama'],
                    count: 9,
                    filters: ['#mlf', '#japan']
                }]
            },
            addAccounts: function(accounts) {

            }
        })
    }

    angular.module('loopr').controller('EditStripCtrl', EditStripCtrl);

})();
