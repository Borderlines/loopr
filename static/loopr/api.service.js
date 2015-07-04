(function() {
    'use strict';

    Shows.$inject = ['Restangular'];
    function Shows(Restangular) {
        return Restangular.service('shows');
    }

    Accounts.$inject = ['Restangular'];
    function Accounts(Restangular) {
        return Restangular.service('accounts');
    }

    angular.module('loopr.api', ['restangular'])
        .factory('Shows', Shows)
        .factory('Accounts', Accounts)
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: '_id',
                etag: '_etag'
            });
            RestangularProvider.addRequestInterceptor(function(element, operation, route, url, a, b) {
                if (operation === 'put') {
                    delete element._id;
                    delete element._updated;
                    delete element._links;
                    delete element._created;
                    delete element._etag;
                    delete element._status;
                }
                return element;
            });
            RestangularProvider.setDefaultHttpFields({cache: false});
            // add a response interceptor
            RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                if (operation === "getList") {
                    var extractedData;
                    extractedData = data._items;
                    extractedData.meta = data._meta;
                    return extractedData;
                }
                return data;
            });
        }]);

})();
