(function() {
    'use strict';

    SearchCtrl.$inject = ['query', 'results', 'Player', '$uibModal'];
    function SearchCtrl(query, results, Player, $uibModal) {
        var vm = this;
        angular.extend(vm, {
            query: query,
            results: results,
            play: function(item) {
                Player.playItem(item);
            },
            addItemToAShow: function openModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addItemToShowModal.html',
                    controller: ModalInstanceCtrl,
                    controllerAs: 'vm',
                    resolve: {
                        shows: function () {
                            return ['shows'];
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    console.log('result', result);
                }, function (err) {
                    console.log('err', err);
                });
            }
        });
    }

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'shows'];
    function ModalInstanceCtrl($scope, $uibModalInstance, shows) {
        var vm = this;
        angular.extend(vm, {
            ok: function() {
                $uibModalInstance.close('pouet!');
            },
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        });
    }

    LoopExplorerCtrl.$inject = ['Player', '$scope', 'strip'];
    function LoopExplorerCtrl(Player, scope, stripService) {
        var vm = this;
        function reorderShows() {
            var indexOfCurrentShow = _.findIndex(Player.loop.shows_list, function(s) {return s === Player.currentShow;});
            var reordered = Player.loop.shows_list.slice(indexOfCurrentShow, Player.loop.shows_list.length);
            vm.shows = reordered.concat(Player.loop.shows_list.slice(0, indexOfCurrentShow));
        }
        angular.extend(vm, {
            player: Player,
            stripService: stripService
        });
        scope.$watch(function() {
            return Player.currentShow;
        }, reorderShows);
    }

    ShowExplorerCtrl.$inject = ['Player', '$scope', 'strip', 'show'];
    function ShowExplorerCtrl(Player, scope, stripService, show) {
        var vm = this;
        angular.extend(vm, {
            stripService: stripService,
            show: show,
            playingNow: Player.currentShow === show,
            player: Player
        });
        scope.$watch(function() {
            return Player.currentShow;
        }, function(currentShow) {
            vm.playingNow = currentShow === show;
        });
    }

    angular.module('loopr.strip')
    .controller('SearchCtrl', SearchCtrl)
    .controller('LoopExplorerCtrl', LoopExplorerCtrl)
    .controller('ShowExplorerCtrl', ShowExplorerCtrl)
    .directive('infinitScroll', ['$timeout', function($timeout) {
        return {
            transclude: true,
            template: ['<div class="infinit-scroll__wrapper">',
            '<div class="infinit-scroll__item" ng-transclude></div>',
            '<div class="infinit-scroll__item" ng-transclude ng-if="infinitScrollEnable"></div>',
            '</div>'].join(''),
            link: function(scope, element) {
                $timeout(function() {
                    scope.infinitScrollEnable = element.find('.infinit-scroll__item').width() > element.width();
                });
                scope.$on('$destroy', function() {
                    element.unbind('scroll');
                });
                scope.$watch('infinitScrollEnable', function(infinitScrollEnable) {
                    $timeout(function() {
                        if (scope.infinitScrollEnable) {
                            var items = element.find('.infinit-scroll__item');
                            element.scrollLeft(items[1].offsetLeft);
                            element.scroll(function(a,b) {
                                if (element.scrollLeft() >= items.width() * 2 - element.width()) {
                                    element.scrollLeft(items[1].offsetLeft - element.width());
                                }
                                if (element.scrollLeft() === 0) {
                                    element.scrollLeft(items.width());
                                }
                            });
                        } else {
                            element.unbind('scroll');
                        }
                    });
                });
            }
        };
    }])
    .directive('l8prExploreLoop', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: '/static/strip/panels/loop.html',
            controllerAs: 'vm',
            controller: LoopExplorerCtrl,
            // TODO: move this code to a smaller directive
            link: function(scope, element, attr, vm) {
                function resizeWidth() {
                    var scale = [150, 350];
                    var widths = vm.shows.map(function(show) {
                        return show.duration();
                    });
                    var maxWidth = Math.max.apply(null, widths);
                    var minWidth = Math.min.apply(null, widths);
                    // set the width depending of the duration
                    scope.getWidth = function(show) {
                        return (scale[1] - scale[0]) * (show.duration() / (maxWidth - minWidth)) + scale[0];
                    };
                }
                function resizeAll() {
                    $timeout(function() {
                        resizeWidth();
                        element.find('.Loop__shows').scrollLeft(0);
                    });
                }
                resizeAll();
                scope.$watch(function() {
                    return vm.shows;
                }, resizeAll);
            }
        };
    }]);
})();
