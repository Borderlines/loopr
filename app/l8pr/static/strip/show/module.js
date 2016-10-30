import * as actions from '../../player/actions';
import { showSelector, itemSelector } from '../../player/selectors';

ShowExplorerCtrl.$inject = ['$ngRedux', '$scope', 'showConfig',
'addToShowModal', '$confirm'];
function ShowExplorerCtrl($ngRedux, $scope, showConfig,
addToShowModal, $confirm) {
    var vm = this;
    const mapStateToTarget = (state) => {
        let show = state.strip.stripParams.show;
        return {
            strip: state.strip,
            show: show,
            player: state.player,
            playingNow: showSelector(state.player) === show,
            currentItem: itemSelector(state.player),
            currentShow: showSelector(state.player),
        }
    }
    let disconnect = $ngRedux.connect(mapStateToTarget, actions)(vm);
    $scope.$on('$destroy', disconnect);
    angular.extend(vm, {
        showConfig: function() {
            showConfig(vm.show);
        },
        removeItem: function(item) {
            $confirm({text: 'Are you sure you want to delete?'}).then(function() {
                // FIXME: use redux
                // var oldShow = Restangular.copy(show);
                // _.remove(oldShow.items, function(i) {
                //     // FIXME: item can have no id
                //     return item.id === i.id;
                // });
                // oldShow.items = angular.copy(oldShow.items);
                // return oldShow.put().then(function(s) {
                //     show.items = s.items;
                // });
            });
        },
        addItemToAShow: addToShowModal
    });
}


angular.module('loopr.strip')
.directive('looprStripShow', () => ({
    scope: {},
    controller: ShowExplorerCtrl,
    controllerAs: 'vm',
    templateUrl: '/strip/show/template.html'
}))
.controller('ShowExplorerCtrl', ShowExplorerCtrl);
