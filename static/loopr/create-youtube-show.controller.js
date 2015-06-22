(function() {
    'use strict';

    CreateYoutubeShowCtrl.$inject = ['api'];
    function CreateYoutubeShowCtrl(api) {
        var vm = this;
        angular.extend(vm, {
            links: ['aaaa']
        });
        console.log(api.shows);
    }

    angular.module('loopr').controller('CreateYoutubeShowCtrl', CreateYoutubeShowCtrl);

})();