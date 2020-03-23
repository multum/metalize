'use strict';

const helpers = require('../helpers');

const schema = 'metalize_schema';

const options = {
  dialect: 'mysql',
  connectionConfig: {
    host: 'localhost',
    password: '',
    user: 'root',
    port: 3306,
  },
};

describe(`'${options.dialect}' dialect`, () => {
  helpers.setup({
    ...options,
    schema,
    onGotAdditionalBlocks: (metalize) => {
      test('unsupported sequence reading', () => {
        return expect(
          metalize.read({ sequences: ['sequence_name'] })
        ).rejects.toThrow(
          `Reading a sequence for the '${options.dialect}' dialect is not supported`
        );
      });
    },
  });
});
