'use strict';

exports.postgres = {
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  port: process.env.POSTGRES_PORT || 25432,
};

exports.mysql = {
  host: process.env.MYSQL_HOST || 'localhost',
  password: process.env.MYSQL_PASSWORD || 'mysql',
  database: process.env.MYSQL_DATABASE || 'mysql',
  user: process.env.MYSQL_USER || 'root',
  port: process.env.MYSQL_PORT || 23306,
};
