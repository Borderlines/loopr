(function() {
    'use strict';

    LoopCtrl.$inject = ['Loops', '$location', 'login', '$rootScope'];
    function LoopCtrl(Loops, $location, login, $rootScope) {
        var vm = this;

        angular.extend(vm, {
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
                Loops.getList({user_id: login.user._id, embedded:{shows:1}}).then(function(loop) {
                    vm.loop = loop[0];
                });
            }
        });
        vm.refreshLoop();

        $rootScope.$on('loopUpdated', vm.refreshLoop);


    }

    angular.module('loopr').controller('LoopCtrl', LoopCtrl);

})();
