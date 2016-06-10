(function() {
'use strict';

ModalInstanceCtrl.$inject = ['login', '$http', '$uibModalInstance'];
function ModalInstanceCtrl(login, $http, $uibModalInstance) {
    var vm = this;
    angular.extend(vm, {
        cancel: function() {
            $uibModalInstance.dismiss('cancel');
        },
        login: function() {
            $http.post('api-auth/login/', {
                // submit:'Log+in'
                username: vm.username,
                password: vm.password
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: function(data){
                    return $.param(data);
                }
            }).success(function(responseData) {
                login.login().then($uibModalInstance.close);
            });
        }
    });
}

angular.module('loopr.login', ['loopr.api'])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}])
.service('login', ['Api', '$rootScope', '$uibModal',
function(Api, $rootScope, $uibModal) {
    $rootScope.user = {};
    var service = {
        currentUser: {},
        logout: function() {
            service.currentUser = {};
            return Api.Auth.one('logout').get();
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
                size: 'sm',
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
