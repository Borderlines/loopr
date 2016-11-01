import * as playerAction from '../player/actions';

ModalInstanceCtrl.$inject = ['login', '$uibModalInstance', 'Api', '$ngRedux', '$scope'];
function ModalInstanceCtrl(login, $uibModalInstance, Api, $ngRedux, $scope) {
    var vm = this;
    const mapStateToTarget = (state) => ({
        auth: state.auth
    })
    let disconnect = $ngRedux.connect(mapStateToTarget, playerAction)(vm);
    $scope.$on('$destroy', disconnect);
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
                vm.login(vm.username, vm.password)
                .then($uibModalInstance.close);
            }, function onError(e) {
                vm.registerErrors = e.data;
            });
        },
        handleLogin: function() {
            vm.loginError = false;
            vm.login(vm.username, vm.password)
            .then($uibModalInstance.close, function error(err) {
                vm.loginError = true;
            });
        }
    });
}

const login = angular.module('loopr.login', ['loopr.api'])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'x-csrftoken';
}])
.service('login', ['Api', '$uibModal', '$http', '$q',
function(Api, $uibModal, $http, $q) {
    var service = {
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

export default login.name;
