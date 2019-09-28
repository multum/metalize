'use strict';

const helpers = require('../helpers');

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  database: 'mysql',
  port: 3306,
};

helpers.setup({
  dialect: 'mysql',
  connectionConfig,
  schema: connectionConfig.database,
});
