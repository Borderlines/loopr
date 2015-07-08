

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope'];
    function StripCtrl($interval, $scope) {
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
                scope: {
                    title: '='
                },
                restrict: 'E',
                controller: StripCtrl,
                controllerAs: 'strip',
                templateUrl: '/static/loopr/partials/strip.html'
            }
        });

})();
