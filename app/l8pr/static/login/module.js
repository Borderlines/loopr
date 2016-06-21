(function() {
'use strict';

ModalInstanceCtrl.$inject = ['login', '$http', '$uibModalInstance', 'Api'];
function ModalInstanceCtrl(login, $http, $uibModalInstance, Api) {
    var vm = this;
    angular.extend(vm, {
        cancel: function() {
            $uibModalInstance.dismiss('cancel');
        },
        recover: function() {
            Api.Register.one('password').one('reset').customPOST({
                email: vm.email
            }).then(function onSuccess(d) {
                $uibModalInstance.close();
            }, function onError(e) {
                vm.recoverErrors = e.data;
            });
        },
        create: function() {
            vm.registerErrors = undefined;
            if (vm.registerForm.$invalid) {
                return;
            }
            Api.Register.one('register').customPOST({
                password: vm.password,
                email: vm.email,
                username: vm.username
            }).then(function onSuccess(d) {
                login.loginWithCred(vm.username, vm.password).then($uibModalInstance.close);
            }, function onError(e) {
                vm.registerErrors = e.data;
            });
        },
        login: function() {
            vm.loginError = false;
            login.loginWithCred(vm.username, vm.password).then($uibModalInstance.close, function error(err) {
                vm.loginError = true;
            });
        }
    });
}

angular.module('loopr.login', ['loopr.api'])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}])
.service('login', ['Api', '$rootScope', '$uibModal', '$http', '$q',
function(Api, $rootScope, $uibModal, $http, $q) {
    $rootScope.user = {};
    var service = {
        currentUser: {},
        logout: function() {
            service.currentUser = {};
            return Api.Auth.one('logout').get();
        },
        loginWithCred: function(username, password) {
            return $q(function(resolve, reject) {
                $http.post('api-auth/login/', {
                    username: username,
                    password: password
                }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: function(data){
                        return $.param(data);
                    }
                }).success(function(responseData) {
                    resolve(service.login());
                });
            });
        },
        login: function() {
            return Api.Accounts.one('me').get().then(function(currentUser) {
                $rootScope.currentUser = currentUser;
                service.currentUser = currentUser;
                return currentUser;
            });
        },
        openLoginView: function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/login/template.html',
                controller: ModalInstanceCtrl,
                controllerAs: 'vm'
            });
            return modalInstance.result;
        }
    };
    return service;
}]);
})();
