(function() {
'use strict';
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://web:4444/wd/hub',
    chromeOnly: true,
    directConnect: true,
    specs: ['specs/*_spec.js']
};
})();
