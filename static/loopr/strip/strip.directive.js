

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope', '$rootScope', '$timeout'];
    function StripCtrl($interval, $scope, $rootScope, $timeout) {
        var vm = this;

        angular.extend(vm, {
            previousShow: function() {$rootScope.$broadcast('player.previousShow');},
            previousItem: function() {$rootScope.$broadcast('player.previousItem');},
            nextItem: function() {$rootScope.$broadcast('player.nextItem');},
            nextShow: function() {$rootScope.$broadcast('player.nextShow');}
        });

        var animations = [];
        $scope.$watch('lines', function(lines, old_value) {
            if (!lines) {return;}
            animations.forEach(function(animation) {
                $timeout.cancel(animation);
            });
            lines.forEach(function(line, index) {
                // (function(line) {
                    animations.push($timeout(function() {
                        $('.strip-line').stop().animate({
                            top: -70
                            // opacity: 0
                        }, 1000, function() {
                            $(this).html(line);
                            $('.strip-line').stop().animate({
                                // opacity: 1,
                                top: 0
                            }, 1000);
                        });
                    }, 10000 * index));
                // })(line);
            });
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
                    lines: '=',
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
