(function() {
    'use strict';
    AddToShowMenuCtrl.$inject = ['login'];
    function AddToShowMenuCtrl(login) {
        var vm = this;
        angular.extend(vm, {
            shows: login.currentUser.loops[0].shows_list,
            showing: false,
            open: function() {
                vm.showing = true;
            },
            close: function() {
                vm.showing = false;
            },
            addToShow: function(show) {
                
                vm.close();
            }
        });
    }

    angular.module('loopr.addToShow', ['loopr.login'])
    .directive('addToShowMenu', ['$window', '$timeout', '$document', function($window, $timeout, $document) {
        return {
            restrict: 'E',
            scope: {item: '='},
            templateUrl: '/static/strip/add-to-shows/template.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: AddToShowMenuCtrl,
            link: function(scope, element, attr, vm) {
                $document.on('click', function(e) {
                    $timeout(function() {
                        if (!$.contains(element.get(0), e.target)) {
                            vm.close();
                        }
                    });
                });
            }
        };
    }]);

})();
