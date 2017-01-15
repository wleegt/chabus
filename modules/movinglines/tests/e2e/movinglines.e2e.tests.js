'use strict';

describe('Movinglines E2E Tests:', function () {
  describe('Test Movinglines page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/movinglines');
      expect(element.all(by.repeater('movingline in movinglines')).count()).toEqual(0);
    });
  });
});
