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
            },
            // item: item,
            // addToShow: function(show) {
            //     $q.when((function() {
            //         if (vm.item.id === null) {
            //             return findOrCreateItem({url: vm.item.url});
            //         } else {
            //             if (vm.item.id.toString().indexOf('.') > -1) {
            //                 var id = vm.item.id.split('.');
            //                 if (id[1] === 'item') {
            //                     vm.item.id = id[2];
            //                 }
            //             }
            //             return vm.item;
            //         }
            //     })()).then(function(item) {
            //         show.items.unshift(item);
            //         show.save().then(function() {
            //             $uibModalInstance.close(show);
            //         });
            //     });
            // },
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
