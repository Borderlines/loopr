(function() {
    'use strict';

    angular.module('loopr', ['ngRoute', 'loopr.api', 'loopr.strip', 'angular-embed',
                            'ngSanitize', 'LocalStorageModule', 'ui.gravatar'])
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
                    templateUrl: 'static/loopr/editor/edit-show/template.html',
                    controller: 'EditShowCtrl',
                    controllerAs: 'vm',
                    activetab: 'shows'
                })
                .when('/video-show/:showId?', {
                    templateUrl: 'static/loopr/editor/edit-show/template.html',
                    controller: 'EditVideoShowCtrl',
                    activetab: 'shows'
                })
                .when('/music-show/:showId?', {
                    templateUrl: 'static/loopr/editor/edit-show/template.html',
                    controller: 'EditMusicShowCtrl',
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
                .when('/account', {
                    templateUrl: 'static/loopr/editor/account/template.html',
                    controller: 'AccountCtrl',
                    controllerAs: 'vm',
                    activetab: 'account'
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
        .run(['login', '$rootScope', '$route', '$location', function(login, $rootScope, $route, $location) {
            login.login();
            // Add to Root Scope
            angular.extend($rootScope, {
                $route: $route,
                openShow: function(show) {
                    $location.url('/show/' + show._id);
                }
            });
        }])
        .service('login', ['Restangular', 'localStorageService', 'Accounts', '$rootScope', '$location',
        function(Restangular, localStorageService, Accounts, $rootScope, $location) {
            var user = localStorageService.get('user');
            var service = {
                login: function(username, password) {
                    if (angular.isDefined(username)) {
                        localStorageService.set('auth', btoa(username + ':' + password));
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
            $rootScope.$on('unauthorized', service.logout);
            $rootScope.logout = service.logout;
            return service;
        }])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('APIInterceptor');
        }])
        .service('APIInterceptor', ['$rootScope', function($rootScope) {
            var service = this;
            service.responseError = function(response) {
                if (response.status === 401) {
                    $rootScope.$broadcast('unauthorized');
                }
                return response;
            };
        }])
        .directive('contenteditable', ['$sce', function($sce) {
            return {
                restrict: 'A', // only activate on element attribute
                require: '?ngModel', // get a hold of NgModelController
                link: function(scope, element, attrs, ngModel) {
                  if (!ngModel) {return;} // do nothing if no ng-model
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
                    $scope.windowWidth = $window.innerWidth;
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
                    var time_str = '';
                    if (hours > 0) {
                        time_str += hours + 'h';
                    }
                    return time_str + minutes + 'm' + seconds + 's';
                }
            };
        });

})();
