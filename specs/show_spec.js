// spec.js
(function() {
    'use strict';

    function login() {
        element(by.css('[ng-click="vm.openLoginView()"]')).click();
        element(by.id('inputUsername')).sendKeys('vied12');
        element(by.id('inputPassword')).sendKeys('pouet');
        browser.waitForAngular();
        element(by.css('[form="loginForm"]')).click();
        browser.waitForAngular();
    }
    beforeEach(function() {
        browser.get('/vied12');
        element(by.css('.toggle-controller')).click();
        login();
    });
    afterEach(function() {
        browser.manage().logs().get('browser').then(function(browserLogs) {
            browserLogs.forEach(function(log){
                console.log(log.message);
            });
        });
    });
    describe('Show', function() {
        var items = element.all(by.repeater('item in vm.show.items'));
        var shows = element.all(by.repeater('show in ::vm.shows'));
        function clickOnFirstShow() {
            shows.get(0).element(by.css('a')).click();
        }
        it('should remove an item from a show', function() {
            clickOnFirstShow();
            items.count().then(function(initialCount) {
                // remove
                items.get(0).element(by.css('[ng-click="vm.removeItem(item)"]')).click();
                // confirm
                element(by.css('[ng-click="ok()"]')).click();
                // check
                expect(items.count()).toEqual(initialCount - 1);
                // reload and check again
                browser.refresh();
                expect(items.count()).toEqual(initialCount - 1);
            });
        });
    });
})();
