

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope', '$rootScope', '$timeout', 'Loops', '$element', 'Fullscreen'];
    function StripCtrl($interval, $scope, $rootScope, $timeout, Loops, $element, Fullscreen) {
        var vm = this;

        angular.extend(vm, {
            underlines: []
        });
        if ($scope.player) {
            angular.extend(vm, {
                previousShow: $scope.player.previousShow,
                previousItem: $scope.player.previousItem,
                nextItem: $scope.player.nextItem,
                nextShow: $scope.player.nextShow,
                playPause: $scope.player.playPause,
                setPosition: function($event) {
                    return $scope.player.setPosition(($event.offsetX / $event.currentTarget.offsetWidth) * 100);
                },
                toggleFullscreen: function() {
                    if (Fullscreen.isEnabled()) {
                        Fullscreen.cancel();
                    } else {
                        Fullscreen.all();
                    }
                }
            });
        }
        // // Underlines
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
                $scope.underlines = underlines;
            }
        });
    }

    angular.module('loopr.strip', ['ngSanitize', 'ngAnimate', 'FBAngular'])
        .directive('strip', function() {
            return {
                scope: {
                    stripQueries: '=',
                    lines: '=',
                    progression: '=',
                    logo: '=',
                    player: '=',
                    showController: '='
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
        })
        .directive('time', ['$interval', function($interval) {
            return {
                restrict: 'E',
                link: function($scope, element) {
                    $interval(function() {
                        function checkTime(i) {
                            return (i < 10) ? '0' + i : i;
                        }
                        var today = new Date(),
                            h = checkTime(today.getHours()),
                            m = checkTime(today.getMinutes());
                            $scope.time = h + ':' + m;
                    }, 2000);
                },
                template: '<div class="time" ng-bind="time"></div>'
            };
        }])
        .directive('banner', ['$interval', function($interval) {
            return {
                restrict: 'E',
                scope: {
                    'lines': '=',
                    'transition': '@',
                    'duration': '@'
                },
                link: function($scope, element) {
                    var transitions = {
                        'fade': [{opacity: 0}, {opacity: 1}],
                        'scroll': [{top: -70}, {top: 0}]
                    };
                    var animation;
                    var body = element.find('.body');

                    function showTitle(title) {
                        body.stop().animate(transitions[$scope.transition][0], 1000, function() {
                            $(this).html(title);
                            body.stop().animate(transitions[$scope.transition][1], 1000);
                        });
                    }

                    $scope.$watch('lines', function(new_value) {
                        if (!angular.isDefined(new_value)) {return;}
                        // show title
                        showTitle(new_value[0]);
                        // loop over titles
                        if (new_value.length > 1) {
                            var current_title = new_value[1];
                            $interval.cancel(animation);
                            animation = $interval(function() {
                                showTitle(current_title);
                                current_title = new_value[(new_value.indexOf(current_title) + 1) % new_value.length];
                            }, parseInt($scope.duration, 10) * 1000);
                        }
                    });
                    $scope.$on('$destroy', function() {
                        $interval.cancel(animation);
                    });
                },
                template: '<div class="body" ng-bind-html="line"></div>'
            };
        }]);
})();
