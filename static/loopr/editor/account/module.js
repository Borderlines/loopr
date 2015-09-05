(function() {
    'use strict';

    AccountCtrl.$inject = ['Accounts', '$scope', 'login', '$location'];
    function AccountCtrl(Accounts, $scope, login, $location) {
        var vm = this;
        if (!login.user) {
            return $location.url('/login');
        }
        angular.extend(vm, {
            changeEmail: function() {
                vm.patch({email: vm.new_email});
                vm.new_email = undefined;
            },
            changePassword: function() {
                vm.patch({password: vm.new_password1});
                vm.new_password1 = undefined;
                vm.new_password2 = undefined;
            },
            patch: function(fields) {
                return vm.user.patch(fields).then(vm.loadAccount);
            },
            loadAccount: function() {
                return Accounts.one($scope.user.username).get({time: new Date()}).then(function(user) {
                    vm.user = user;
                    return user;
                });
            }
        });
        vm.loadAccount();
    }

    angular.module('loopr').controller('AccountCtrl', AccountCtrl);

})();
