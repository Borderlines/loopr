(function() {
    'use strict';

    Shows.$inject = ['Restangular'];
    function Shows(Restangular) {
        return Restangular.service('shows');
    }

    angular.module('loopr.api', ['restangular'])
        .factory('Shows', Shows)
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: '_id',
                etag: '_etag',
            });
            RestangularProvider.setRequestInterceptor(function(element, operation, route, url, a, b) {
                if (operation === 'put') {
                    delete element._id;
                    delete element._updated;
                    delete element._links;
                    delete element._created;
                    delete element._etag;
                    console.log('element', element, operation, route, url, a, b);
                }
                return element;
            });
        }]);

})();