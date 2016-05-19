(function() {
    'use strict';

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'shows'];
    function ModalInstanceCtrl($scope, $uibModalInstance, shows) {
        var vm = this;
        angular.extend(vm, {
            ok: function() {
                $uibModalInstance.close();
            },
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        });
    }

    AddToShowService.$inject = ['$uibModal'];
    function AddToShowService($uibModal) {
        return function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/static/strip/add-to-shows/template.html',
                controller: ModalInstanceCtrl,
                controllerAs: 'vm',
                resolve: {
                    shows: function () {
                        return ['shows'];
                    }
                }
            });
            return modalInstance.result;
        };
    }

    angular.module('loopr.addToShow', [])
    .factory('addToShowModal', AddToShowService);


})();
