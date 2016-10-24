import * as actions from '../player/actions';
import {showSelector, itemSelector} from '../player/selectors';

StripCtrl.$inject = ['$ngRedux', 'progression', '$interval', 'upperStrip', 'Player', '$scope'];
function StripCtrl($ngRedux, progression, $interval, upperStrip, Player, $scope) {
    var vm = this;
    const mapStateToTarget = (state) => ({
        strip: state.strip,
        upperStrip: state.strip.upperStrip,
        player: state.player,
        currentShow: showSelector(state.player),
        currentItem: itemSelector(state.player)
    })
    let disconnect = $ngRedux.connect(mapStateToTarget, actions)(vm);
    $scope.$on('$destroy', disconnect);
    const {username, loopToExplore} = $ngRedux.getState().router.currentParams;
    Player.loadLoop(loopToExplore || username).then(function(loop) {
        vm.setStripLoop(loop.shows_list);
    });
    angular.extend(vm, {
        upperStrip: upperStrip,
        progression: 0,
        setPosition: ($event) => progression.setPosition(($event.offsetX / $event.currentTarget.offsetWidth) * 100)
    });
    $interval(() => {
        vm.progression = progression.getValue();
    }, 1000);
}

export default StripCtrl;
