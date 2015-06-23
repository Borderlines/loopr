(function() {
    'use strict';

    function apiService() {
        return {
            show: 'blka'
        };
    }

    angular.module('loopr.api', []).factory('api', apiService);

})();