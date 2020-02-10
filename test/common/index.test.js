'use strict';

const { expect } = require('chai');
const Metalize = require('../../lib');
const BaseConnectionManager = require('../../lib/dialects/base/connectionManeger');

describe('common', () => {
  it('unsupported dialect', () => {
    let error;
    try {
      new Metalize({ dialect: 'mongodb' });
    } catch (e) {
      error = e;
    }
    expect(error).to.instanceOf(Error);
    expect(error.message).to.equal(`Dialect 'mongodb' is not supported`);
  });

  it('missing dependency', () => {
    const connectionManager = new BaseConnectionManager();
    let error;
    try {
      connectionManager._loadDialectModule('missing--dependency');
    } catch (e) {
      error = e;
    }
    expect(error).to.instanceOf(Error);
    expect(error.message).to.equal(
      `Please install 'missing--dependency' package manually`
    );
  });
});
