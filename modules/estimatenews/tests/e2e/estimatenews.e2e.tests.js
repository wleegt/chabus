'use strict';

describe('Estimatenews E2E Tests:', function () {
  describe('Test Estimatenews page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/estimatenews');
      expect(element.all(by.repeater('estimatenew in estimatenews')).count()).toEqual(0);
    });
  });
});
