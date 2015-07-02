(function() {
    'use strict';

    ShowsCtrl.$inject = ['Shows'];
    function ShowsCtrl(Shows) {
        var vm = this;
        Shows.getList().then(function(shows) {
            vm.shows = shows;
        });
    }

    angular.module('loopr').controller('ShowsCtrl', ShowsCtrl);

})();
