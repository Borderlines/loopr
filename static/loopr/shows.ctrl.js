(function() {
    'use strict';

    ShowsCtrl.$inject = ['Shows'];
    function ShowsCtrl(Shows) {
        var vm = this;

        angular.extend(vm, {
            getShowDuration: function(show) {
                if (angular.isDefined(show.links)) {
                    return show.links.reduce(function(a, b) {return  a + b.duration;}, 0);
                }
            }
        })

        Shows.getList({timestamp:Date.now()}).then(function(shows) {
            vm.shows = shows;
        });
    }

    angular.module('loopr').controller('ShowsCtrl', ShowsCtrl);

})();
