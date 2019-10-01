'use strict';

const Metalize = require('../../lib');

describe('common', () => {
  it('unsupported dialect', done => {
    try {
      new Metalize({ dialect: 'mongodb' });
    } catch (e) {
      return done();
    }
    throw new Error('error test');
  });
});
