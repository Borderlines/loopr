(function() {
    'use strict';

    ModalInstanceCtrl.$inject = ['$uibModalInstance', 'show', 'Restangular'];
    function ModalInstanceCtrl($uibModalInstance, show, Restangular) {
        var vm = this;
        angular.extend(vm, {
            shows: show,
            settings: angular.copy(show.settings),
            save: function() {
                var newShow = Restangular.copy(show);
                angular.extend(newShow, {settings: vm.settings});
                newShow.save().then(function(savedShow) {
                    show.settings = savedShow.settings;
                    $uibModalInstance.close(show);
                });
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
