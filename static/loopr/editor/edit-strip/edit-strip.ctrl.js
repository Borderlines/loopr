(function() {
    'use strict';

    EditStripCtrl.$inject = ['Shows', '$location', 'login', '$rootScope', 'Loops'];
    function EditStripCtrl(Shows, $location, login, $rootScope, Loops) {
        var vm = this;
        if (!login.user) {
            return $location.url('/login');
        }
        angular.extend(vm, {
            loop: undefined,
            deleteQuery: function(index) {
                var loop = vm.loop.clone();
                loop.twitter_queries.splice(index, 1);
                loop.save();
                vm.refresh();
            },
            addAccounts: function(keywords) {
                var query = {
                    keywords: keywords.split(' '),
                    count: 5,
                    filters: []
                };
                var loop = vm.loop.clone();
                if (!angular.isDefined(loop.twitter_queries)) {
                    loop.twitter_queries = [];
                }
                loop.twitter_queries.push(query);
                loop.save().then(function(loop) {
                    vm.refresh();
                });
            },
            refresh: function() {
                return Loops.getList({where: {user_id: login.user._id}}).then(function(loop) {
                    vm.loop = loop[0];
                    return loop[0];
                });
            }
        });
        vm.refresh();
    }

    angular.module('loopr').controller('EditStripCtrl', EditStripCtrl);

})();
