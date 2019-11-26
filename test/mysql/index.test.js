'use strict';

const helpers = require('../helpers');

const options = {
  dialect: 'mysql',
  connectionConfig: {
    host: 'localhost',
    user: 'root',
    database: 'mysql',
    port: 3306,
  },
};

describe(`'${options.dialect}' dialect`, () => {
  helpers.setup({
    ...options,
    schema: options.connectionConfig.database,
    onGotAdditionalBlocks: metalize => {
      it('unsupported sequence reading', async () => {
        try {
          await metalize.read.sequences(['sequence_name']);
        } catch (e) {
          return true;
        }
        throw new Error('error test');
      });
    },
  });
});
