

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$rootScope'];
    function StripCtrl($interval, $scope) {
        var vm = this;

        angular.extend(vm, {
            previousShow: function() {$scope.$broadcast('player.previousShow');},
            previousItem: function() {$scope.$broadcast('player.previousItem');},
            nextItem: function() {$scope.$broadcast('player.nextItem');},
            nextShow: function() {$scope.$broadcast('player.nextShow');}
        });

        // set time
        $interval(function() {
            function checkTime(i) {
                return (i < 10) ? "0" + i : i;
            }
            var today = new Date(),
                h = checkTime(today.getHours()),
                m = checkTime(today.getMinutes());
                vm.time = h + ":" + m;
        }, 2000);

    }

    angular.module('loopr.strip', [])
        .directive('strip', function() {
            return {
                scope: {
                    title: '=',
                    progression: '=',
                    logo: '='
                },
                restrict: 'E',
                controller: StripCtrl,
                controllerAs: 'strip',
                templateUrl: '/static/loopr/strip/strip.html'
            }
        });

})();
