'use strict';

const helpers = require('../helpers');

const connectionConfig = {
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
};

helpers.setup({ dialect: 'postgres', connectionConfig, schema: 'public' });
