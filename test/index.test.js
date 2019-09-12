'use strict';

const Metalize = require('../lib');
const connectionConfig = require('./pg.config');
const { expect } = require('chai');

const _tableName = 'public.metalize_users';
const _sequenceName = _tableName + '_seq';

describe('test reading', () => {
  const metalize = new Metalize({
    dialect: 'postgres',
    connectionConfig,
  });

  before(() => {
    return metalize._client.query(`
    drop table if exists ${_tableName} cascade;
    create table ${_tableName} (
      id bigint primary key,
      name varchar(255),
      age smallint
    );
    drop sequence if exists ${_sequenceName};
    create sequence ${_sequenceName}
      start with 100
      increment by 1
      minvalue 100
      maxvalue 9999
      cycle;
    `);
  });

  after(async () => {
    await metalize._client.query(`drop table if exists ${_tableName} cascade`);
    return metalize.endConnection();
  });

  it('reading tables', async () => {
    const tables = await metalize.read.tables([_tableName]);
    const users = tables[_tableName];

    expect(users.columns).to.have.lengthOf(3);
    expect(users.primaryKey.columns[0]).to.equal('id');
  });

  it('reading sequences', async () => {
    const sequences = await metalize.read.sequences([_sequenceName]);
    const users = sequences[_sequenceName];

    expect(users).to.include({
      start: '100',
      min: '100',
      max: '9999',
      increment: '1',
      cycle: true,
    });
  });
});
