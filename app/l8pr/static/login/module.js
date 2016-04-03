(function() {
'use strict';

LoginController.$inject = ['login'];
function LoginController(login) {
    var vm = this;
    angular.extend(vm, {
        login: login
    });
    vm.login.login();
}

angular.module('loopr.login', ['loopr.api'])
.directive('l8prLogin', function() {
    return {
        scope: {},
        templateUrl: '/static/login/template.html',
        controller: LoginController,
        controllerAs: 'vm'
    };
})
.service('login', ['Accounts', '$rootScope', '$location', '$window', 'Auth',
function(Accounts, $rootScope, $location, $window, Auth) {
    $rootScope.user = {};
    var service = {
        loginWithFb: function() {
            $window.location.href = '/auth/login/facebook';
        },
        logout: function() {
            service.currentUser = undefined;
            return Auth.one('logout').get();
        },
        login: function() {
            return Accounts.one('me').get().then(function(currentUser) {
                $rootScope.currentUser = currentUser;
                service.currentUser = currentUser;
                return currentUser;
            });
        }
    };
    return service;
}]);
})();