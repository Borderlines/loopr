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
        play: function(item) {
            Player.playItem(item);
        },
        addItemToAShow: function openModal(item) {
            addToShowModal(item);
        }
    });
    $scope.$watch(function() {
        return vm.filters;
    }, function() {
        var activeFiltersKeys = Object.keys(vm.filters);
        var activeFilters = activeFiltersKeys.filter(function(key) {
            return vm.filters[key];
        });
        vm.results = _.filter(results, function(r) {
            return _.contains(activeFilters, r.provider_name);
        });
    }, true);
    // adds youtube results
    if (query) {
        Api.SearchYoutube.getList({q: query}).then(function(results) {
            vm.results = vm.results.concat(results);
        });
    }
}

angular.module('loopr.strip')
.controller('SearchCtrl', SearchCtrl);

})();
