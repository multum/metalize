'use strict';

const helpers = require('../helpers');

const dialect = 'postgres';
const schema = 'MetalizeSchema';

describe(`'${dialect}' dialect`, () => {
  helpers.setup({ dialect, schema });
});
