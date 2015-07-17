(function() {
    'use strict';

    EditVideoShowCtrl.$inject = ['Shows', 'embedService', '$location', '$routeParams', '$route', '$rootScope', '$q'];
    function EditVideoShowCtrl(Shows, embedService, $location, $routeParams, $route, $rootScope, $q) {
        var vm = this;
        if (!angular.isDefined($routeParams.showId)) {
            Shows.post({type: 'VideoShow', title: 'Your Show'}).then(function(new_show) {
                vm.show = new_show;
                $route.updateParams({showId: vm.show._id});
            });
        }
        angular.extend(vm, {
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
                    vm.loadShow();
                });
            },
            loadShow: function() {
                return Shows.one($routeParams.showId).get().then(function(show) {
                    vm.show = show;
                });
            },
            addVideo: function(link) {
                if (link.indexOf(', ') > -1) {
                    var links = link.split(', ');
                    var promise = $q.when();
                    links.forEach(function(link) {
                        promise = promise.then(function() {
                            return vm.addVideo(link);
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
                        provider_name: data.provider_name
                    };
                    if (!vm.show.links) {
                        vm.show.links = [];
                    }
                    var new_show = vm.show.clone();
                    new_show.links.push(link);
                    vm.url = undefined;
                    return vm.saveShow(new_show);
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
            }
        });
        vm.loadShow();
    }

    angular.module('loopr').controller('EditVideoShowCtrl', EditVideoShowCtrl);

})();
