import * as playerAction from '../../player/actions';

StripHeaderCtrl.$inject = ['$ngRedux', '$scope', 'login'];
function StripHeaderCtrl($ngRedux, $scope, login) {
    var vm = this;
    const mapStateToTarget = (state) => ({
        searchBarVisible: state.strip.searchBar,
        // router: state.router,
        // player: state.player,
        strip: state.strip,
        auth: state.auth,
        // currentShow: showSelector(state.player),
        // currentItem: itemSelector(state.player)
    })
    let disconnect = $ngRedux.connect(mapStateToTarget, playerAction)(vm);
    $scope.$on('$destroy', disconnect);
    angular.extend(vm, {
        searchQuery: '',
    //     searchQuery: $state.params.q,
    //     searchBarVisible: $state.current.name === 'root.app.open.search' && ($state.params.q === undefined || $state.params.q === ''),
    //     // loopAuthor: loopToExplore.username,
    //     // showsCount: loopToExplore.shows_list.length,
    //     loginService: login,
        openLoginView: login.openLoginView,
        search: function(query) {
            console.warn('TODO: SEARCH')
        }
    });
    // login to know the current user
    // login.login();
    // listen for key shortcut
    // $rootScope.$on('openSearch', function() {
    //     vm.searchQuery = '';
    //     vm.searchBarVisible = true;
    // });
}

angular.module('loopr.stripHeader', [])
.directive('looprStripHeader', [function() {
    return {
            scope: {},
            templateUrl: '/strip/header/template.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: StripHeaderCtrl
    };
}])
.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].focus();
                }
            });
        }
    };
});
