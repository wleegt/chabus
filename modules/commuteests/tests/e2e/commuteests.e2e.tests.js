'use strict';

describe('Commuteests E2E Tests:', function () {
  describe('Test Commuteests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/commuteests');
      expect(element.all(by.repeater('commuteest in commuteests')).count()).toEqual(0);
    });
  });
});
