(function() {
'use strict';

StripHeaderCtrl.$inject = ['strip', 'login'];
function StripHeaderCtrl(strip, login) {
    var vm = this;
    angular.extend(vm, {
        stripService: strip,
        login: login
    });
}

angular.module('loopr.stripHeader', [])
.directive('l8prStripHeader', [function() {
    return {
            scope: {},
            templateUrl: '/static/strip/header/template.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: StripHeaderCtrl
    };
}]);

})();
