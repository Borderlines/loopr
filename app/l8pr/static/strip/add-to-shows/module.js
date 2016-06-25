(function() {
    'use strict';

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'shows', 'item',
    '$q', 'Api', 'login', '$rootScope', 'ApiCache'];
    function ModalInstanceCtrl($scope, $uibModalInstance, shows, item,
    $q, Api, login, $rootScope, ApiCache) {
        var vm = this;
        angular.extend(vm, {
            shows: shows,
            item: item,
            newShow: {},
            createShow: function() {
                $q.all([
                    Api.FindOrCreateItem({url: vm.item.url}),
                    login.login()
                ]).then(function(values) {
                    vm.newShow.items = [values[0]];
                    vm.newShow.user = values[1].id;
                    Api.Shows.post(vm.newShow).then(function(show) {
                        $uibModalInstance.close(show);
                        ApiCache.isDirty = true;
                        $rootScope.$broadcast('l8pr.updatedLoop');
                    });
                });
            },
            addToShow: function(show) {
                $q.when((function() {
                    if (vm.item.id === null) {
                        return Api.FindOrCreateItem({url: vm.item.url});
                    } else {
                        if (vm.item.id.toString().indexOf('.') > -1) {
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
                        ApiCache.isDirty = true;
                        $rootScope.$broadcast('l8pr.updatedShow', show);
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
                    shows: ['Api', 'login', function (Api, login) {
                        // FIXME: if not loged ?
                        return Api.Shows.getList({user: login.currentUser.id, ordering: '-updated'});
                    }]
                }
            });
            return modalInstance.result;
        };
    }

    angular.module('loopr.addToShow', [])
    .factory('addToShowModal', AddToShowService);


})();
