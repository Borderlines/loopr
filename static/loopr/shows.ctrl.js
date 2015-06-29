(function() {
    'use strict';

    ShowsCtrl.$inject = ['Shows'];
    function ShowsCtrl(Shows) {
        var vm = this;
        vm.shows = Shows.getList().$object;
    }

    angular.module('loopr').controller('ShowsCtrl', ShowsCtrl);

})();
