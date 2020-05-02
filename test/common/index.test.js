'use strict';

const Metalize = require('../../lib');
const {
  getManuallyInstalledModule,
} = require('../../lib/dialects/common/helpers');

describe('common', () => {
  test('unsupported dialect', () => {
    expect(() => {
      new Metalize('mongodb');
    }).toThrow(`Dialect 'mongodb' is not supported`);
  });

  test('missing dependency', () => {
    expect(() => {
      getManuallyInstalledModule('missing--dependency');
    }).toThrow(`Please install 'missing--dependency' package manually`);
  });
});
