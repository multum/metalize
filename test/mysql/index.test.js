'use strict';

const helpers = require('../helpers');

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  database: 'mysql',
  port: 3306,
};

const _test = metalize => {
  it('unsupported sequence reading', async () => {
    try {
      await metalize.sequences([]);
    } catch (e) {
      return true;
    }
    throw new Error('error test');
  });
};

helpers.setup({
  dialect: 'mysql',
  connectionConfig,
  schema: connectionConfig.database,
  onGotAdditionalBlocks: _test,
});
