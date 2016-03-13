

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope', 'strip', 'login',
                         'Fullscreen', 'Accounts', 'gravatarService', 'upperStrip', 'lowerStrip'];
    function StripCtrl($interval, $scope, stripService, login,
                       Fullscreen, Accounts, gravatarService, upperStrip, lowerStrip) {
        var vm = this;
        angular.extend(vm, {
            upperStrip: upperStrip,
            lowerStrip: lowerStrip,
            stripService: stripService,
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
                isFullScreen: Fullscreen.isEnabled,
                toggleFullscreen: function() {
                    if (Fullscreen.isEnabled()) {
                        Fullscreen.cancel();
                    } else {
                        Fullscreen.all();
                    }
                },
                panelOpened: false,
                openPanel: function(panel_name) {
                    if (vm.panelOpened === panel_name) {
                        vm.panelOpened = false;
                    } else {
                        vm.panelOpened = panel_name;
                    }
                },
                login: login
            });
        }
        $scope.$on('player.play', function ($event, item, show) {
            // update avatar
            Accounts.one(show.user).get()
            .then(function(user) {
                $scope.author = user;
                $scope.avatar = gravatarService.url(user.email, {size: 150, d: 'mm'});
                return user;
            });
        });
    }

    function bannerService() {
        var service = {
            banner: [],
            setBanner: function(banner) {
                service.banner = banner;
            },
            addQueries: function(queries) {
                if (queries) {
                    var underlines = [];
                    queries.forEach(function(query) {
                        if (angular.isDefined(query.results) && angular.isDefined(query.results.items)) {
                            if (query.type === 'twitter') {
                                query.results.items.forEach(function(tweet) {
                                    underlines.push('<div class="tweet"><i class="icon-sourcetwitter"></i><a href="https://twitter.com/' +
                                    tweet.user.screen_name+'/status/'+tweet.id_str +
                                    '" target="_blank"><b>@'+tweet.user.name+'</b> ' +
                                    tweet.text + '</a></div>');
                                });
                            }
                            if (query.type === 'rss') {
                                query.results.items.forEach(function(rss) {
                                    underlines.push('<div class="rss"><i class="icon-sourcerss"></i><a href="'+rss.link+'" target="_blank"><b>'+query.results.title+'</b> ' +
                                    rss.title + '</a></rss>');
                                });
                            }
                        }
                    });
                    service.setBanner(underlines);
                }
            }
        };
        return service;
    }

    angular.module('loopr.strip', ['ngSanitize', 'ngAnimate', 'FBAngular', 'perfect_scrollbar'])
        .factory('strip', ['$timeout', function($timeout) {
            var hideTimeout;
            var service = {
                showController: false,
                toggleController: function() {
                    service.showController = !service.showController;
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
        .factory('lowerStrip', function() {
            return bannerService();
        })
        .factory('upperStrip', function() {
            return bannerService();
        })
        .directive('strip', function() {
            return {
                scope: {
                    progression: '=',
                    logo: '=',
                    player: '='
                },
                restrict: 'E',
                controller: StripCtrl,
                controllerAs: 'vm',
                templateUrl: '/static/strip/strip.html'
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
