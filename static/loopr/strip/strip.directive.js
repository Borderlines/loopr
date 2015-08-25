

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope', '$rootScope', '$timeout', 'Loops', '$element', 'Player'];
    function StripCtrl($interval, $scope, $rootScope, $timeout, Loops, $element, Player) {
        var vm = this;

        angular.extend(vm, {
            player: Player,
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
                        underlines.push('<a href="https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str +
                        '" target="_blank"><b>@'+tweet.user.screen_name+'</b> ' +
                        tweet.text + '</a>');
                    });
                });
                underline_animations.forEach($timeout.cancel);
                var showUnderlines = function (underlines) {
                    underlines.forEach(function(line, index) {
                        underline_animations.push($timeout(function() {
                            var text = $element.find('.lower-strip .wrapper-inner');
                            $(text).stop().animate({
                                opacity: 0
                            }, 1000, function() {
                                $(this).html(line);
                                $(text).stop().animate({
                                    opacity: 1
                                }, 1000);
                            });
                            if (index === underlines.length - 1) {
                                showUnderlines(underlines);
                            }
                        }, 15000 * index));
                    });
                };
                showUnderlines(underlines);
            }
        });
        // Texts
        var animations = [];
        $scope.$watch('lines', function(lines, old_value) {
            if (!lines) {return;}
            vm.reduced_mode = false;
            animations.forEach($timeout.cancel);
            animations = [];
            var delay_between_animations = 5000;
            lines.forEach(function(line, index) {
                var text = $element.find('.upper-strip .wrapper-inner');
                animations.push($timeout(function() {
                    text.stop().animate({
                        top: -70
                    }, 1000, function() {
                        $(this).html(line);
                        text.stop().animate({
                            top: 0
                        }, 1000);
                    });
                }, delay_between_animations * index));
            });
            // // hide after every msg were displayed
            // animations.push($timeout(function() {
            //     vm.reduced_mode = true;
            // }, delay_between_animations * lines.length));
        });
        // Set Time
        $interval(function() {
            function checkTime(i) {
                return (i < 10) ? '0' + i : i;
            }
            var today = new Date(),
                h = checkTime(today.getHours()),
                m = checkTime(today.getMinutes());
                vm.time = h + ':' + m;
        }, 2000);
    }

    angular.module('loopr.strip', ['ngSanitize', 'ngAnimate'])
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
            };
        })
        .directive('dynamicHeight', function() {
            return {
                restrict: 'A',
                link: function($scope, element) {
                    $scope.$watch(function() {
                        return element.children()[0].offsetHeight;
                    },
                    function(value, old) {
                        if (value === 0 || Math.abs(old - value) < 5 ) {
                            return;
                        }
                        var new_height = Math.max(element.children()[0].offsetHeight, 28);
                        $(element).css('height', new_height + 'px');
                    });
                }
            };
        });

})();
