ProgressionService.$inject = ['$rootScope'];
export default function ProgressionService($rootScope) {
    let bindedFct = angular.noop;
    let service = {
        clear: bindedFct = angular.noop,
        getValue: () => bindedFct(),
        bindProgression: (prog) => bindedFct = prog,
        setPosition: (percent) => $rootScope.$broadcast('player.seekTo', percent)
    };
    return service;
}
