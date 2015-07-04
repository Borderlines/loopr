(function() {
    'use strict';

    angular.module('loopr', ['ngRoute', 'loopr.api', 'angular-embed', 'ngSanitize'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/shows', {
                    controller: 'ShowsCtrl',
                    templateUrl: 'static/loopr/partials/shows-list.html',
                    controllerAs: 'vm'
                })
                .when('/show/:showId?', {
                    templateUrl: 'static/loopr/partials/edit-youtube-show.html',
                    controller: 'EditVideoShowCtrl',
                    controllerAs: 'vm'
                })
                .when('/create-user', {
                    templateUrl: 'static/loopr/partials/create-user.html',
                    controller: 'CreateUserCtrl',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/create-user'
                });
            }
        ])
        .service('login', function() {
            var auth = '1234';
            return function() {
                // login: function()
                auth: auth
            }
        })
        .directive('clickLink', ['$location', function($location) {
            return {
                link: function(scope, element, attrs) {
                    element.on('click', function() {
                        scope.$apply(function() {
                            $location.path(attrs.clickLink);
                        });
                    });
                }
            }
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
