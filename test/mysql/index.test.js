'use strict';

const helpers = require('../helpers');

const dialect = 'mysql';
const schema = 'metalize_schema';

describe(`'${dialect}' dialect`, () => {
  helpers.setup({
    dialect,
    schema,
    onGotAdditionalBlocks: (metalize) => {
      test('unsupported sequence reading', () => {
        return expect(
          metalize.find({ sequences: ['sequence_name'] })
        ).rejects.toThrow(
          `Reading a sequence for the '${dialect}' dialect is not supported`
        );
      });
    },
  });
});
