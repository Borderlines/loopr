(function() {
    'use strict';

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'shows', 'item'];
    function ModalInstanceCtrl($scope, $uibModalInstance, shows, item) {
        var vm = this;
        angular.extend(vm, {
            shows: shows,
            item: item,
            addToShow: function(show) {
                show.items.unshift(vm.item);
                show.save().then(function() {
                    $uibModalInstance.close(show);
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
