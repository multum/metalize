'use strict';

const { expect } = require('chai');
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
        let error;
        try {
          await metalize.read({ sequences: ['sequence_name'] });
        } catch (e) {
          error = e;
        }
        expect(error).to.instanceOf(Error);
        expect(error.message).to.equal(
          `Reading a sequence for the '${options.dialect}' dialect is not supported`
        );
      });
    },
  });
});
