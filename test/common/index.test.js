'use strict';

const Metalize = require('../../lib');
const BaseConnectionManager = require('../../lib/dialects/base/connectionManeger');

describe('common', () => {
  it('unsupported dialect', done => {
    try {
      new Metalize({ dialect: 'mongodb' });
    } catch (e) {
      return done();
    }
    throw new Error('error test');
  });

  it('missing dependency', done => {
    const connectionManager = new BaseConnectionManager();
    try {
      connectionManager._loadDialectModule('missing--dependency');
    } catch (e) {
      return done();
    }
    throw new Error('error test');
  });
});
