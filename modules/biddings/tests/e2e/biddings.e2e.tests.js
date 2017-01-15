'use strict';

describe('Biddings E2E Tests:', function () {
  describe('Test Biddings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/biddings');
      expect(element.all(by.repeater('bidding in biddings')).count()).toEqual(0);
    });
  });
});
