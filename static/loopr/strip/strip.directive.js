

(function() {
    'use strict';

    StripCtrl.$inject = ['$interval', '$scope', 'login',
                         'Fullscreen', 'Accounts', 'gravatarService', 'upperStrip', 'lowerStrip'];
    function StripCtrl($interval, $scope, login,
                       Fullscreen, Accounts, gravatarService, upperStrip, lowerStrip) {
        var vm = this;
        angular.extend(vm, {
            upperStrip: upperStrip,
            lowerStrip: lowerStrip,
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
                },
                addToFavs: function() {
                    login.login().then(function(user) {
                        user.favorites = user.favorites || [];
                        var to_fav = $scope.player.loop.user._id;
                        // add
                        if (user.favorites.indexOf(to_fav) === -1) {
                            user.favorites.push(to_fav);
                            user.patch(_.pick(user, 'favorites'));
                            $scope.inFavorites = true;
                        // remove
                        } else {
                            user.favorites.splice(user.favorites.indexOf(to_fav), 1);
                            user.patch(_.pick(user, 'favorites'));
                            $scope.inFavorites = false;
                        }
                    });
                }
            });
        }
        $scope.$on('player.play', function ($event, item, show) {
            // update avatar
            Accounts.one(show.user_id).get()
            .then(function(user) {
                $scope.author = user;
                $scope.avatar = gravatarService.url(user.email, {size: 150, d: 'mm'});
                return user;
            });
            login.login().then(function(user) {
                $scope.inFavorites = user.favorites.indexOf(show.user_id) > -1;
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
                        if (query.type === 'twitter') {
                            query.results.forEach(function(tweet) {
                                underlines.push('<div class="tweet"><i class="icon-social-twitter"></i><a href="https://twitter.com/' +
                                tweet.user.screen_name+'/status/'+tweet.id_str +
                                '" target="_blank"><b>@'+tweet.user.name+'</b> ' +
                                tweet.text + '</a></div>');
                            });
                        }
                        if (query.type === 'rss') {
                            query.results.items.forEach(function(rss) {
                                underlines.push('<div class="rss"><i class="fa fa-rss"></i><a href="'+rss.link+'" target="_blank"><b>'+query.results.title+'</b> ' +
                                rss.title + '</a></rss>');
                            });
                        }
                    });
                    service.setBanner(underlines);
                }
            }
        };
        return service;
    }

    angular.module('loopr.strip', ['ngSanitize', 'ngAnimate', 'FBAngular'])
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
