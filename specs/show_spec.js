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
        browser.waitForAngular();
        element(by.css('.toggle-controller')).click();
        browser.waitForAngular();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        login();
    });
    afterEach(function() {
        browser.driver.get(browser.baseUrl + '/api/auth/logout/');
    });
    function openShow(show) {
        element(by.cssContainingText('[ui-sref="index.open.show({showToExplore: show})"]', show)).click();
    }
    describe('Show', function() {
        var items = element.all(by.repeater('item in vm.show.items'));
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
                    expect(element(by.css('.list__item__title', itemTitle)).isPresent()).toBe(true);
                });
            });
        });
        xit('search an url and add it', function() {
            element(by.css('[ng-click="vm.searchBarVisible = !vm.searchBarVisible"]')).click();
            element(by.model('vm.searchQuery'))
                .sendKeys('https://www.youtube.com/watch?v=dYHAFRtrL-Q')
                .sendKeys(protractor.Key.ENTER);
            element.all(by.repeater('result in vm.getResults()')).get(0)
            .element(by.css('[ng-click="$event.stopPropagation(); vm.addItemToAShow(result);"]'))
            .click();
            var shows = element.all(by.repeater('show in vm.shows'));
            shows.get(0).element(by.css('.list__item__title')).getText().then(function(showName) {
                shows.get(0).click();
                browser.waitForAngular();
                browser.get('/vied12/loop/');
                browser.waitForAngular();
                openShow(showName);
                expect(element(by.css('.list__item__title', 'Best Of - Alexandre Astier')).isPresent()).toBe(true);
            });
        });
    });
    describe('Open', function() {
        function openUrlInLoopr(url, title) {
            browser.get('/open/' + encodeURIComponent(url));
            browser.waitForAngular();
            browser.sleep(1000);
            element(by.css('.banner__title')).getText().then(function(itemTitle) {
                expect(itemTitle).toBe(title);
                element(by.css('.toggle-controller')).click();
                element(by.css('.banner [ng-click="vm.addToShowModal(vm.Player.currentItem)"]')).click();
                var shows = element.all(by.repeater('show in vm.shows'));
                shows.get(1).element(by.css('.list__item__title')).getText().then(function(showName) {
                    shows.get(1).click();
                    browser.get('/vied12/loop/');
                    openShow(showName);
                    expect(element(by.css('.list__item__title', itemTitle)).isPresent()).toBe(true);
                    element(by.css('[ui-sref="index.open.loop"]')).click();
                    openShow('my inbox');
                    expect(element(by.css('.list__item__title', itemTitle)).isPresent()).toBe(true);
                });
            });
        }
        fit('open an url with loopr.tv (firefox extension)', function() {
            openUrlInLoopr('https://www.youtube.com/watch?v=sSrXhylmIQc',
                'Top 10 Science Experiments - Experiments You Can Do at Home Compilation');
            openUrlInLoopr('https://www.youtube.com/watch?v=05E-mtVbMIE',
                '6 Science Tricks - Amazing Experiments');
        });
    });
})();
