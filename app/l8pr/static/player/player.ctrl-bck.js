// import * as PlayerActions from './actions/player';
import { stateGo } from 'redux-ui-router';

PlayerCtrl.$inject = ['$ngRedux', '$scope'];
function PlayerCtrl($ngRedux, $scope) {
    var vm = this;
    // Which part of the Redux global state does our component want to receive?
    let disconnect = $ngRedux.connect(state => ({router: state.router}), {stateGo})(vm);
    $scope.$on('$destroy', disconnect);
}
angular.module('loopr.player')
.controller('PlayerCtrl', PlayerCtrl);
