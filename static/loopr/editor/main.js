(function() {
    'use strict';

    angular.module('loopr', ['ngRoute', 'loopr.api', 'angular-embed', 'ngSanitize', 'LocalStorageModule'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/shows', {
                    controller: 'ShowsCtrl',
                    templateUrl: 'static/loopr/editor/partials/shows-list.html',
                    controllerAs: 'vm'
                })
                .when('/show/:showId?', {
                    templateUrl: 'static/loopr/editor/partials/edit-youtube-show.html',
                    controller: 'EditVideoShowCtrl',
                    controllerAs: 'vm'
                })
                .when('/login', {
                    templateUrl: 'static/loopr/editor/partials/login.html',
                    controller: 'CreateUserCtrl',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/shows'
                });
            }
        ])
        .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('loopr')
                .setStorageType('localStorage')
                .setNotify(true, true);
        }])
        .run(['login', function(login) {
            login.login();
        }])
        .service('login', ['Restangular', 'localStorageService', 'Accounts', '$rootScope', '$location',
        function(Restangular, localStorageService, Accounts, $rootScope, $location) {
            var user = localStorageService.get('user');
            var service = {
                login: function(username, password) {
                    if (angular.isDefined(username)) {
                        localStorageService.set('auth', btoa(username + ":" + password));
                    } else if (user) {
                        username = user.username;
                    }
                    if (angular.isDefined(username)) {
                        Restangular.setDefaultHeaders({'Authorization':'Basic ' + localStorageService.get('auth')});
                        return Accounts.one(username).get().then(function(data) {
                            localStorageService.set('user', data);
                            service.user = data;
                            $rootScope.user = data;
                            return service.user;
                        });
                    }
                },
                logout: function() {
                    localStorageService.remove('user');
                    localStorageService.remove('auth');
                    Restangular.setDefaultHeaders({'Authorization':''});
                    service.user = null;
                    $rootScope.user = null;
                    $location.url('/');
                },
                auth: localStorageService.get('auth'),
                user: user
            };
            $rootScope.logout = service.logout;
            return service;
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
