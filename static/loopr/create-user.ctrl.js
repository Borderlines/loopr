(function() {
    'use strict';

    CreateUserCtrl.$inject = ['Accounts', 'Restangular'];
    function CreateUserCtrl(Accounts, Restangular) {
        var vm = this;

        angular.extend(vm, {
            createUser: function() {
                Accounts.post({username: vm.username, password: vm.password}).then(function(data) {
                    console.log(data);
                });
            },
            login: function() {
                // Restangular.setDefaultHeaders({'Authorization':'Basic '+btoa(vm.username2 + ":" + vm.password2)});
            }
        });

    }

    angular.module('loopr').controller('CreateUserCtrl', CreateUserCtrl);

})();
