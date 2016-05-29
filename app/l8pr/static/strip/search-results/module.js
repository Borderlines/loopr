(function() {
'use strict';

SearchCtrl.$inject = ['query', 'results', 'Player', 'addToShowModal', 'SearchYoutube'];
function SearchCtrl(query, results, Player, addToShowModal, SearchYoutube) {
    var vm = this;
    angular.extend(vm, {
        query: query,
        results: results,
        play: function(item) {
            Player.playItem(item);
        },
        addItemToAShow: function openModal(item) {
            addToShowModal(item);
        }
    });
    // adds youtube results
    if (query) {
        SearchYoutube.getList({q: query}).then(function(results) {
            vm.results = vm.results.concat(results);
        });
    }
}

angular.module('loopr.strip')
.controller('SearchCtrl', SearchCtrl);

})();
