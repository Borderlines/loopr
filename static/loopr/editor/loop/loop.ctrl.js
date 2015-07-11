(function() {
    'use strict';

    LoopCtrl.$inject = ['Loops', '$location', 'login', '$rootScope', '$scope', 'Restangular'];
    function LoopCtrl(Loops, $location, login, $rootScope, $scope, Restangular) {
        var vm = this;

        angular.extend(vm, {
            addingMode: false,
            deleteFromLoop: function(index) {
                var loop = vm.loop.clone();
                loop.shows.splice(index, 1);
                loop.shows = loop.shows.map(function(e) {return e._id;});
                loop.save();
                vm.refreshLoop();
            },
            openShow: function(show) {
                $location.url('/show/' + show._id);
            },
            refreshLoop: function() {
                Loops.getList({where: {user_id: login.user._id}, embedded:{shows:1}, timestamp:Date.now()}).then(function(loop) {
                    vm.loop = loop[0];
                });
            },
            startAddingMode: function(show) {
                vm.addingMode = true;
                vm.showToAdd = show;
            },
            addAtPosition: function(index) {
                var loop = vm.loop.clone();
                loop.shows.splice(index, 0, vm.showToAdd);
                loop.shows = loop.shows.map(function(e) {return e._id;});
                loop.save();
                vm.refreshLoop();
                vm.addingMode = false;
                vm.showToAdd = undefined;
            }
        });
        vm.refreshLoop();

        var loopUpdatedSubscription = $rootScope.$on('loopUpdated', vm.refreshLoop);
        var openAddingShowModeSubscription = $rootScope.$on('openAddingShowMode', function(event, show) {
            vm.startAddingMode(show);
        });
        $scope.$on('$destroy', function() {
            loopUpdatedSubscription();
            openAddingShowModeSubscription();
        });

    }

    angular.module('loopr')
    .controller('LoopCtrl', LoopCtrl)
    .directive('loop', function() {
        return {
            controller: 'LoopCtrl',
            controllerAs: 'loopCtrl',
            templateUrl: 'static/loopr/editor/loop/loop.html'
        }
    });

})();
