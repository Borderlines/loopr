

(function() {
    'use strict';

    angular.module('loopr.strip', ['ngSanitize', 'ngAnimate', 'FBAngular', 'loopr.addToShow', 'loopr.stripHeader'])
        .factory('strip', ['$timeout', '$state', function($timeout, $state) {
            var hideTimeout;
            var service = {
                showController: true,
                toggleController: function() {
                    var indexStateName = 'index';
                    if ($state.current.name !== indexStateName) {
                        $state.go(indexStateName);
                    } else {
                        // TODO: restore saved previous state
                        $state.go(indexStateName + '.loop');
                    }
                },
                isAutoHideEnabled: false,
                showAndHide: function() {
                    if (service.isAutoHideEnabled) {
                        $timeout.cancel(hideTimeout);
                        service.hideStrip(false);
                        hideTimeout = $timeout(function() {
                            service.hideStrip(true);
                        }, 5000);
                    }
                },
                autoHideToggle: function(enable) {
                    $timeout.cancel(hideTimeout);
                    if (!angular.isDefined(enable)) {
                        enable = !service.isAutoHideEnabled;
                    }
                    service.isAutoHideEnabled = enable;
                    service.hideStrip(service.isAutoHideEnabled);
                },
                stripIsHidden: false,
                toggleStrip: function() {
                    service.stripIsHidden = !service.stripIsHidden;
                },
                hideStrip: function(hidden) {
                    service.stripIsHidden = hidden;
                }
            };
            return service;
        }])
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

                    function showTitle(title, fast) {
                        if (!angular.isDefined(fast)) {
                            fast = false;
                        }
                        body.stop().animate(transitions[$scope.transition][0], fast? 0 : 1000, function() {
                            $(this).html(title);
                            body.stop().animate(transitions[$scope.transition][1], 1000);
                        });
                    }

                    $scope.$watch('lines', function(new_value) {
                        if (!angular.isDefined(new_value)) {return;}
                        // show title
                        showTitle(new_value[0], true);
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
