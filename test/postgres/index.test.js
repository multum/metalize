'use strict';

const helpers = require('../helpers');

const schema = 'metalize_schema';

const options = {
  dialect: 'postgres',
  connectionConfig: {
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  },
};

describe(`'${options.dialect}' dialect`, () => {
  helpers.setup({
    ...options,
    schema,
  });
  helpers.setup({
    ...options,
    schema: 'Parallel_' + schema, // test 'quoted identifiers'
  });
});
