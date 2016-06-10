(function() {
    'use strict';

    ModalInstanceCtrl.$inject = ['$uibModalInstance', 'show'];
    function ModalInstanceCtrl($uibModalInstance, show) {
        var vm = this;
        angular.extend(vm, {
            shows: show,
            settings: show.settings,
            save: function() {
                show.settings = vm.settings;
                show.save();
                $uibModalInstance.close(show);
            },
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        });
    }

    ShowConfigFactory.$inject = ['$uibModal'];
    function ShowConfigFactory($uibModal) {
        return function(show) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/strip/show-config/template.html',
                controller: ModalInstanceCtrl,
                controllerAs: 'vm',
                resolve: {
                    show: function() {
                        return show;
                    }
                }
            });
            return modalInstance.result;
        };
    }

    angular.module('loopr.showconfig', [])
    .factory('showConfig', ShowConfigFactory);


})();
