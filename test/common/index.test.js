'use strict';

const Metalize = require('../../lib');
const BaseConnectionManager = require('../../lib/dialects/base/connection-maneger');

describe('common', () => {
  test('unsupported dialect', () => {
    expect(() => {
      new Metalize({ dialect: 'mongodb' });
    }).toThrow(`Dialect 'mongodb' is not supported`);
  });

  test('missing dependency', () => {
    expect(() => {
      new BaseConnectionManager().loadDialectModule('missing--dependency');
    }).toThrow(`Please install 'missing--dependency' package manually`);
  });
});
