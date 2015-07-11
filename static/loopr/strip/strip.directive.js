

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
        // Underlines
        var underline_animations = [];
        $scope.$watch('stripQueries', function(queries, old_value) {
            if (queries) {
                var underlines = [];
                queries.forEach(function(query) {
                    query.results.forEach(function(tweet) {
                        underlines.push('@'+tweet.user.name+': '+tweet.text);
                    });
                });
                underline_animations.forEach($timeout.cancel);
                var showUnderlines = function (underlines) {
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
                            if (index == underlines.length - 1) {
                                showUnderlines(underlines);
                            }
                        }, 4000 * index));
                    });
                }
                showUnderlines(underlines);
            }
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
                    stripQueries: '=',
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
