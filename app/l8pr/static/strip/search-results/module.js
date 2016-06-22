(function() {
'use strict';

SearchCtrl.$inject = ['query', 'results', 'Player', 'addToShowModal', 'Api', '$scope'];
function SearchCtrl(query, results, Player, addToShowModal, Api, $scope) {
    var vm = this;
    angular.extend(vm, {
        query: query,
        results: angular.copy(results),
        filters: {
            YouTube: true,
            SoundCloud: true,
            Vimeo: true
        },
        getResults: function() {
            var activeFiltersKeys = Object.keys(vm.filters);
            var activeFilters = activeFiltersKeys.filter(function(key) {
                return vm.filters[key];
            });
            return _.filter(vm.results, function(r) {
                if (!r.provider_name) {
                    return true;
                }
                return _.contains(activeFilters, r.provider_name);
            });
        },
        play: function(item) {
            Player.playItem(item);
        },
        addItemToAShow: function openModal(item) {
            addToShowModal(item);
        }
    });
    if (query) {
        // // adds loop results
        // Api.Loops.getList({username: query}).then(function(results) {
        //     var pouet = _.map(results, function(r) {
        //         return {
        //             title: query + '\'s loop',
        //             type: 'loop'
        //         };
        //     });
        //     vm.results = vm.results.concat(pouet);
        // });
        // adds youtube results
        Api.SearchYoutube.getList({q: query}).then(function(results) {
            vm.results = vm.results.concat(results);
        });
    }
}

angular.module('loopr.strip')
.controller('SearchCtrl', SearchCtrl);

})();
