(function() {
    'use strict';

    FeedCtrl.$inject = ['$interval', 'Player'];
    function FeedCtrl($interval, Player) {
        var vm = this;
        var source = JSON.parse(Player.loop.feed_json);
        var timeInterval = 5000; // ms
        if (!source && source.length < 1) {
            return;
        }
        var index = 0;
        var setScope = function(tweet) {
            angular.extend(vm, {
                tweet: tweet
            });
        };
        setScope(source[index]);
        $interval(function() {
            index += 1;
            if (index >= source.length) {index = 0;}
            setScope(source[index]);
        }, timeInterval);
    }

    angular.module('loopr.strip')
    .controller('FeedCtrl', FeedCtrl)
    .directive('l8prFeed', function() {
        return {
            scope: {},
            templateUrl: '/strip/feed/template.html',
            controller: FeedCtrl,
            controllerAs: 'vm'
        };
    });
})();
