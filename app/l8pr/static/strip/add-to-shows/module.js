(function() {
    'use strict';

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'shows', 'item', 'findOrCreateItem', '$q'];
    function ModalInstanceCtrl($scope, $uibModalInstance, shows, item, findOrCreateItem, $q) {
        var vm = this;
        angular.extend(vm, {
            shows: shows,
            item: item,
            addToShow: function(show) {
                $q.when((function() {
                    if (vm.item.id === null) {
                        return findOrCreateItem({url: vm.item.url});
                    } else {
                        if (vm.item.id.indexOf('.') > -1) {
                            var id = vm.item.id.split('.');
                            if (id[1] === 'item') {
                                vm.item.id = id[2];
                            }
                        }
                        return vm.item;
                    }
                })()).then(function(item) {
                    show.items.unshift(item);
                    show.save().then(function() {
                        $uibModalInstance.close(show);
                    });
                });
            },
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        });
    }

    AddToShowService.$inject = ['$uibModal'];
    function AddToShowService($uibModal) {
        return function(item) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/strip/add-to-shows/template.html',
                controller: ModalInstanceCtrl,
                controllerAs: 'vm',
                resolve: {
                    item: function() {
                        return item;
                    },
                    shows: ['Shows', 'login', function (Shows, login) {
                        // FIXME: if not loged ?
                        return Shows.getList({user: login.currentUser.id});
                    }]
                }
            });
            return modalInstance.result;
        };
    }

    angular.module('loopr.addToShow', [])
    .factory('addToShowModal', AddToShowService);


})();
