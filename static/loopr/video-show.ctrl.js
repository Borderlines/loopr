(function() {
    'use strict';

    EditVideoShowCtrl.$inject = ['Shows', 'embedService', '$location', '$routeParams', '$route'];
    function EditVideoShowCtrl(Shows, embedService, $location, $routeParams, $route) {
        var vm = this;
        if (angular.isDefined($routeParams.showId)) {
            Shows.one($routeParams.showId).get().then(function(show) {
                vm.show = show;
            });
        } else {
            Shows.post({type: 'VideoShow'}).then(function(new_show) {
                vm.show = new_show;
                $route.updateParams({showId: vm.show._id});
            });
        }
        angular.extend(vm, {
            removeVideo: function(link) {
                vm.show.links.splice(vm.show.links.indexOf(link), 1);
                vm.saveShow();
            },
            saveShow: function() {
                vm.show.put().then(function(show) {
                    vm.show._etag = show._etag;
                });
            },
            addVideo: function(link) {
                embedService.get(link).then(function(data) {
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
                    vm.show.links.push(link);
                    vm.saveShow();
                });
            }
        });
    }

    angular.module('loopr').controller('EditVideoShowCtrl', EditVideoShowCtrl);

})();