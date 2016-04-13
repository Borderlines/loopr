

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
                // panelOpened: false,
                // openPanel: function(panel_name) {
                //     if (vm.panelOpened === panel_name) {
                //         vm.panelOpened = false;
                //     } else {
                //         vm.panelOpened = panel_name;
                //     }
                // },
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
                                    underlines.push('<div class="rss"><i class="icon-sourcerss"></i><a href="'+rss.link+
                                    '" target="_blank"><b>'+query.results.title+'</b> ' +
                                    rss.title+
                                    '</a></rss>');
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

    angular.module('loopr.strip', ['ngSanitize', 'ngAnimate', 'FBAngular'])
        .factory('strip', ['$timeout', 'Player', function($timeout, Player) {
            var hideTimeout;
            var service = {
                showController: false,
                currentView: {
                    name: undefined,
                    object: undefined,
                    author: undefined,
                    numberOfShow: undefined
                },
                toggleController: function() {
                    service.showController = !service.showController;
                    if (!angular.isDefined(service.currentView.name)) {
                        service.open('loop', Player.loop);
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
                },
                previousState: function() {
                    service._previousStates.pop();
                    if (service._previousStates.length > 0) {
                        var previous = service._previousStates[service._previousStates.length - 1];
                        service.open(previous[0], previous[1]);
                    }
                },
                _previousStates: [],
                open: function(view, obj) {
                    service._previousStates.push([view, obj]);
                    // loop, show
                    angular.extend(service.currentView, {
                        name: view,
                        object: obj
                    });
                    if (obj.user) {
                        if (obj.user.username) {
                            service.currentView.author = obj.user.username;
                        } else {
                            service.currentView.author = obj.user;
                        }
                    }
                    if (obj.shows_list) {
                        service.currentView.numberOfShow = obj.shows_list.length;
                    }
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
