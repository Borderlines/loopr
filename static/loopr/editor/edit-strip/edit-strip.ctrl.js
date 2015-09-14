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
                loop.strip_messages.splice(index, 1);
                loop.save();
                vm.refresh();
            },
            addAccounts: function(query) {
                function isUrl(s) {
                    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                    return regexp.test(s);
                }
                var content = {
                    query: query,
                    type: isUrl(query)? 'rss' : 'twitter'
                };
                var loop = vm.loop.clone();
                if (!angular.isDefined(loop.strip_messages)) {
                    loop.strip_messages = [];
                }
                loop.strip_messages.unshift(content);
                loop.save().then(function(loop) {
                    vm.refresh();
                });
            },
            reorderLink: function(item, direction) {
                var current = vm.loop.strip_messages.indexOf(item);
                var next = current + direction;
                var loop = vm.loop.clone();
                loop.strip_messages.splice(next, 0, loop.strip_messages.splice(current, 1)[0]);
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
