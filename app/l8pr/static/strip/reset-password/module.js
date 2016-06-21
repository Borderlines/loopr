(function() {
    'use strict';
    angular.module('loopr.strip')
    .factory('resetPassword', ['$uibModal', '$stateParams', function($uibModal, $stateParams) {
        return {
            open: function() {
                return $uibModal.open({
                    templateUrl: '/strip/reset-password/template.html',
                    controllerAs: 'vm',
                    controller: ['Api', '$uibModalInstance', function(Api, $uibModalInstance) {
                        var vm = this;
                        angular.extend(vm, {
                            cancel: function() {
                                $uibModalInstance.dismiss('cancel');
                            },
                            confirmReset: function() {
                                vm.errors = undefined;
                                Api.Register.one('password').one('reset').one('confirm').customPOST({
                                    uid: $stateParams.uid,
                                    token: $stateParams.token,
                                    new_password: vm.password
                                }).then(function onSuccess(d) {
                                    $uibModalInstance.close();
                                }, function onError(e) {
                                    vm.errors = e.data;
                                });
                            }
                        });
                    }]
                });
            }
        };
    }]);
})();
