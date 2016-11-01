(function() {
    'use strict';

    FeedCtrl.$inject = ['$interval', 'Player', 'Api', '$scope'];
    function FeedCtrl($interval, Player, Api, $scope) {
        var vm = this;
        var source = JSON.parse('[]');
        // var source = JSON.parse(Player.loop.feed_json);
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
        var nextTweetInterval = $interval(function() {
            index += 1;
            if (index >= source.length) {index = 0;}
            setScope(source[index]);
        }, timeInterval);
        var reloadFeed = $interval(function() {
            if (Player.loop.id) {
                return Api.Loops.one(Player.loop.id).get().then(function(loop) {
                    Player.loop.feed_json = loop.feed_json;
                    source = JSON.parse(loop.feed_json);
                });
            }
        }, 60000 * 3);
        $scope.$on('$destroy', function() {
          // Make sure that the intervals are destroyed
          $interval.cancel(reloadFeed);
          $interval.cancel(nextTweetInterval);
          reloadFeed = null;
          nextTweetInterval = null;
        });
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
