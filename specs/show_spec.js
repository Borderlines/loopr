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
        function openShow(show) {
            element(by.cssContainingText('[ui-sref="index.open.show({showToExplore: show})"]', show)).click();
        }
        it('should remove an item from a show', function() {
            openShow('SLWX');
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
        it('should add an item to a show', function() {
            element(by.css('.banner__title')).getText().then(function(itemTitle) {
                element(by.css('.banner [ng-click="vm.addToShowModal(vm.Player.currentItem)"]')).click();
                var shows = element.all(by.repeater('show in vm.shows'));
                shows.get(0).element(by.css('.list__item__title')).getText().then(function(showName) {
                    shows.get(0).click();
                    browser.get('/vied12/loop/');
                    openShow(showName);
                    expect(items.get(0).element(by.css('.list__item__title')).getText()).toEqual(itemTitle);
                });
            });
        });
        // it('search an url and add it', function() {
        //     element(by.css('[ng-click="vm.searchBarVisible = !vm.searchBarVisible"]')).click();
        //     element(by.model('vm.searchQuery'))
        //         .sendKeys('https://www.youtube.com/watch?v=dYHAFRtrL-Q')
        //         .sendKeys(protractor.Key.ENTER);
        //     element.all(by.repeater('result in vm.getResults()')).get(0)
        //         .element(by.css('[ng-click="$event.stopPropagation(); vm.addItemToAShow(result);"]'))
        //         .click();
        //         var shows = element.all(by.repeater('show in vm.shows'));
        //         shows.get(0).element(by.css('.list__item__title')).getText().then(function(showName) {
        //             shows.get(0).click();
        //             browser.waitForAngular();
        //             browser.get('/vied12/loop/');
        //             browser.waitForAngular();
        //             openShow(showName);
        //             expect(element(by.css('.list__item__title', 'Best Of - Alexandre Astier')).isPresent()).toBe(true);
        //         });
        // });
    });
})();
