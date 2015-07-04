(function() {
    'use strict';

    ShowsCtrl.$inject = ['Shows', '$location'];
    function ShowsCtrl(Shows, $location) {
        var vm = this;

        angular.extend(vm, {
            getShowDuration: function(show) {
                if (angular.isDefined(show.links)) {
                    return show.links.reduce(function(a, b) {return  a + b.duration;}, 0);
                }
            },
            openShow: function(show) {
                $location.url('/show/' + show._id);
            }
        })

        Shows.getList({timestamp:Date.now()}).then(function(shows) {
            vm.shows = shows;
        });
    }

    angular.module('loopr').controller('ShowsCtrl', ShowsCtrl);

})();
