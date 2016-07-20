// spec.js
(function() {
    'use strict';

    beforeEach(function() {
        browser.get('http://web:8000/');
        element(by.css('.toggle-controller')).click();
    });
    describe('Show', function() {
        var items = element.all(by.repeater('item in vm.show.items'));
        var firstShow = element.all(by.repeater('show in ::vm.shows')).get(0);
        it('should remove an item from a show', function() {
            var initialCount = 32;
            firstShow.element(by.css('a')).click();
            expect(items.count()).toEqual(initialCount);
            // remove
            items.get(0).element(by.css('[ng-click="vm.removeItem(item)"]')).click();
            // confirm
            element(by.css('[ng-click="ok()"]')).click();
            // check
            expect(items.count()).toEqual(initialCount - 1);
            // reloead and check again
            // browser.get('http://web:8000/');
            // element(by.css('.toggle-controller')).click();
            // firstShow.element(by.css('a')).click();
            // expect(items.count()).toEqual(initialCount - 1);
        });
    });
})();
