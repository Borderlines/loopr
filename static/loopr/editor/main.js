(function() {
    'use strict';

    angular.module('loopr', ['ngRoute', 'loopr.api', 'loopr.strip', 'angular-embed', 'ngSanitize', 'LocalStorageModule'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/shows', {
                    controller: 'ShowsCtrl',
                    templateUrl: 'static/loopr/editor/shows-list/shows-list.html',
                    controllerAs: 'vm',
                    activetab: 'shows'
                })
                .when('/show/:showId?', {
                    templateUrl: 'static/loopr/editor/edit-video-show/edit-youtube-show.html',
                    controller: 'EditVideoShowCtrl',
                    controllerAs: 'vm',
                    activetab: 'shows'
                })
                .when('/strip', {
                    controller: 'EditStripCtrl',
                    templateUrl: 'static/loopr/editor/edit-strip/edit-strip.html',
                    controllerAs: 'vm',
                    activetab: 'strip'
                })
                .when('/login', {
                    templateUrl: 'static/loopr/editor/login/login.html',
                    controller: 'CreateUserCtrl',
                    controllerAs: 'vm',
                    activetab: 'login'
                })
                .otherwise({
                    redirectTo: '/shows'
                });
            }
        ])
        .run(['login', '$rootScope', '$route', function(login, $rootScope, $route) {
            login.login();
            $rootScope.$route = $route;
        }])
        .directive('contenteditable', ['$sce', function($sce) {
            return {
                restrict: 'A', // only activate on element attribute
                require: '?ngModel', // get a hold of NgModelController
                link: function(scope, element, attrs, ngModel) {
                  if (!ngModel) return; // do nothing if no ng-model
                  // Specify how UI should be updated
                  ngModel.$render = function() {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                  };
                  // Listen for change events to enable binding
                  element.on('blur keyup change', function() {
                    scope.$evalAsync(read);
                  });
                  read(); // initialize
                  // Write data to the model
                  function read() {
                    var html = element.html();
                    html = html.replace(/<br>/g, '');
                    ngModel.$setViewValue(html);
                  }
                }
            };
        }])
        .directive('resizable', function($window) {
            return function($scope) {
                $scope.initializeWindowSize = function() {
                    $scope.windowHeight = $window.innerHeight;
                    return $scope.windowWidth = $window.innerWidth;
                };
                $scope.initializeWindowSize();
                return angular.element($window).bind('resize', function() {
                    $scope.initializeWindowSize();
                    return $scope.$apply();
                });
            };
        })
        .filter('seconds', function() {
            return function(time) {
                if (angular.isDefined(time) && angular.isNumber(time) && !isNaN(time)) {
                    var hours = Math.floor(time / 3600);
                    time = time - hours * 3600;
                    var minutes = Math.floor(time / 60);
                    var seconds = time - minutes * 60;
                    var time_str = ''
                    if (hours > 0) {
                        time_str += hours + 'h';
                    }
                    return time_str + minutes + 'm' + seconds + 's';
                }
            }
        });

})();
