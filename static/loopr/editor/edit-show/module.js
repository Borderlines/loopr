(function() {
    'use strict';

    EditShowCtrl.$inject = ['Shows', 'embedService', '$location', '$routeParams', '$route', '$rootScope', '$q'];
    function EditShowCtrl(Shows, embedService, $location, $routeParams, $route, $rootScope, $q) {
        var vm = this;
        var MAPPING = {
            'VideoShow': 'video-show',
            'MusicShow': 'music-show'
        };
        angular.extend(vm, {
            addLink: function(link) {
                if (link.indexOf(', ') > -1) {
                    var links = link.split(', ');
                    var promise = $q.when();
                    links.forEach(function(link) {
                        promise = promise.then(function() {
                            return vm.addLink(link);
                        });
                    });
                    return promise;
                }
                return embedService.get(link).then(function(data) {
                    var link = {
                        url: data.url,
                        thumbnail: data.thumbnail_url,
                        author_name: data.author_name,
                        title: data.title,
                        html: data.html,
                        provider_name: data.provider_name
                    };
                    if (!vm.show.links) {
                        vm.show.links = [];
                    }
                    var new_show = vm.show.clone();
                    new_show.links.unshift(link);
                    vm.url = undefined;
                    return vm.saveShow(new_show);
                });
            },
            createShow: function(params, redirect) {
                return Shows.post(params).then(function(new_show) {
                    if (redirect) {
                        $route.updateParams({showId: new_show._id});
                    }
                });
            },
            removeVideo: function(link) {
                vm.show.links.splice(vm.show.links.indexOf(link), 1);
                vm.saveShow();
            },
            removeShow: function() {
                vm.show.remove().then(function() {
                    $location.url('/shows');
                    $route.reload();
                });
            },
            saveShow: function(new_show) {
                new_show = new_show || vm.show;
                return new_show.save().then(function() {
                    return vm.loadShow();
                });
            },
            loadShow: function() {
                return Shows.one($routeParams.showId).get().then(function(show) {
                    vm.show = show;
                });
            },
            reorderLink: function(link, direction) {
                var current = vm.show.links.indexOf(link);
                var next = current + direction;
                vm.show.links.splice(next, 0, vm.show.links.splice(current, 1)[0]);
                vm.saveShow();
            },
            addToLoopMode: function() {
                $rootScope.$broadcast('openAddingShowMode', vm.show);
            },
            optionIsSatisifed: function(option) {
                if (!angular.isDefined(vm.show) || !angular.isDefined(option.dependsOn)) {
                    return true;
                }
                for (var key in option.dependsOn) {
                    if (option.dependsOn.hasOwnProperty(key)) {
                        if (option.dependsOn[key] !== vm.show.settings[key]) {
                            return false;
                        }
                    }
                }
                return true;
            }
        });
        // redirect to the specific route/controller
        if (angular.isDefined($routeParams.showId)) {
            Shows.one($routeParams.showId).get().then(function(show) {
                $location.url('/' + MAPPING[show.type] + '/' + show._id);
            });
        }
    }

    angular.module('loopr').controller('EditShowCtrl', EditShowCtrl);

})();
