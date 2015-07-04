(function() {
    'use strict';

    CreateUserCtrl.$inject = ['Accounts', 'Restangular', 'login', '$location'];
    function CreateUserCtrl(Accounts, Restangular, login, $location) {
        var vm = this;
        angular.extend(vm, {
            createUser: function() {
                Accounts.post({username: vm.username, password: vm.password}).then(function(data) {
                    login.login(vm.username, vm.password);
                    $location.url('/');
                });
            },
            login: function() {
                login.login(vm.username, vm.password);
                $location.url('/');
            }
        });
    }

    angular.module('loopr').controller('CreateUserCtrl', CreateUserCtrl);

})();
