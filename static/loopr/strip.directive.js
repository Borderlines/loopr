

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval'];
    function StripCtrl($interval) {
        var vm = this;
        // set time
        $interval(function() {
            function checkTime(i) {
                return (i < 10) ? "0" + i : i;
            }
            var today = new Date(),
                h = checkTime(today.getHours()),
                m = checkTime(today.getMinutes());
                vm.time = h + ":" + m;
        }, 500);
    }

    angular.module('loopr.strip', [])
        .directive('strip', function() {
            return {
                scope: true,
                restrict: 'E',
                controller: StripCtrl,
                controllerAs: 'strip',
                templateUrl: '/static/loopr/partials/strip.html'
            }
        });

})();
