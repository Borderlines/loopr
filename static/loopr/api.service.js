(function() {
    'use strict';

    function apiService() {
        return {
            show: 'blka'
        };
    }

    angular.module('loopr').factory('api', apiService);

})();