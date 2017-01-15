'use strict';

describe('Estimates E2E Tests:', function () {
  describe('Test estimates page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/estimates');
      expect(element.all(by.repeater('estimate in estimates')).count()).toEqual(0);
    });
  });
});
