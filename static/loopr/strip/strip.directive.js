

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope', '$rootScope', '$timeout', 'Loops'];
    function StripCtrl($interval, $scope, $rootScope, $timeout, Loops) {
        var vm = this;

        angular.extend(vm, {
            underlines: [],
            previousShow: function() {$rootScope.$broadcast('player.previousShow');},
            previousItem: function() {$rootScope.$broadcast('player.previousItem');},
            nextItem: function() {$rootScope.$broadcast('player.nextItem');},
            nextShow: function() {$rootScope.$broadcast('player.nextShow');}
        });
        console.log($scope.loop);
        $scope.loop.then(function(loop) {
            console.log(2, loop);
            var underlines = [];
            loop.strip_queries.forEach(function(query) {
                query.results.forEach(function(tweet) {
                    underlines.push('@'+tweet.user.name+': '+tweet.text);
                });
            });
            vm.underlines = underlines;
        });
        // Texts
        var animations = [];
        $scope.$watch('lines', function(lines, old_value) {
            if (!lines) {return;}
            animations.forEach(function(animation) {
                $timeout.cancel(animation);
            });
            lines.forEach(function(line, index) {
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
            });
        });
        // underlines
        var underline_animations = [];
        $scope.$watch(angular.bind(this, function () {return this.underlines;}),
        function(underlines, old_value) {
            if (!underlines) {return;}
            underline_animations.forEach(function(animation) {
                $timeout.cancel(animation);
            });
            underlines.forEach(function(line, index) {
                underline_animations.push($timeout(function() {
                    $('.strip-underline').stop().animate({
                        opacity: 0
                    }, 1000, function() {
                        $(this).html(line);
                        $('.strip-underline').stop().animate({
                            opacity: 1
                        }, 1000);
                    });
                }, 15000 * index));
            });
        });
        // Set Time
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
                    loop: '=',
                    title: '=',
                    lines: '=',
                    underlines: '=',
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
