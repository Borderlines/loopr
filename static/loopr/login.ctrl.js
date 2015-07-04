(function() {
    'use strict';

    CreateUserCtrl.$inject = ['Accounts', 'Restangular', 'login', '$location'];
    function CreateUserCtrl(Accounts, Restangular, login, $location) {
        var vm = this;
        angular.extend(vm, {
            createUser: function() {
                Accounts.post({username: vm.username, password: vm.password}).then(function(data) {
                    vm.login();
                });
            },
            login: function() {
                return login.login(vm.username, vm.password).then(function(){
                    $location.url('/');
                });
            }
        });
    }

    angular.module('loopr').controller('CreateUserCtrl', CreateUserCtrl);

})();
