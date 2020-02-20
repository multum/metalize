'use strict';

const { expect } = require('chai');
const Metalize = require('../lib');

const _query = (client, queries) => {
  return queries
    .filter(Boolean)
    .reduce(
      (acc, query) => acc.then(() => client.query(query)),
      Promise.resolve()
    );
};

exports.setup = ({
  schema,
  dialect,
  connectionConfig,
  onGotAdditionalBlocks = () => null,
  prefix,
}) => {
  const isPostgres = dialect === 'postgres';

  const _table = schema ? `${schema}.metalize_users` : 'metalize_users';
  const _childTable = _table + '_child';
  const _sequence = _table + '_seq';
  const _constraintNames = {
    check: `metalize_check_constraint`,
    foreignKey: `metalize_foreign_key_constraint`,
    unique: `metalize_unique_constraint`,
  };

  prefix = prefix ? `[ ${prefix} ] ` : '';

  const metalize = new Metalize({ dialect, connectionConfig });

  before(() => {
    return _query(metalize._client, [
      schema ? `create schema if not exists ${schema};` : null,
      `drop table if exists ${_table};`,
      `drop table if exists ${_childTable};`,
      `create table ${_childTable} (
          id bigint primary key,
          name varchar(255),
          parent bigint,
          unique (parent, id)
        );`,
      `create table ${_table} (
          id bigint primary key,
          name varchar(255),
          budget numeric(16, 3),
          age smallint,
          child bigint,
          constraint ${_constraintNames.foreignKey} foreign key (id, child)
            references ${_childTable} (parent, id) on update restrict on delete cascade,
          constraint ${_constraintNames.unique} unique (name, age)
        );`,
      `create index index_name on ${_table} (id, child);`,
      isPostgres
        ? `alter table ${_table} add constraint ${_constraintNames.check} check (age > 21)`
        : null,
    ]);
  });

  after(() => {
    return _query(metalize._client, [
      `drop table if exists ${_table};`,
      `drop table if exists ${_childTable};`,
    ]);
  });

  it(`${prefix}reading tables`, async () => {
    const result = await metalize.read({ tables: [_table] });
    const table = result.tables.get(_table);

    expect(table.primaryKey).to.not.eq(undefined);
    expect(table.primaryKey.name).to.be.an('string');
    expect(table.primaryKey).to.deep.include({
      columns: ['id'],
    });

    expect(table.columns).to.have.lengthOf(5);

    expect(table.columns.find(({ name }) => name === 'name')).to.deep.include({
      details: { type: 'character varying', length: 255 },
    });

    expect(table.columns.find(({ name }) => name === 'budget')).to.deep.include(
      {
        details: { type: 'numeric', precision: 16, scale: 3 },
      }
    );

    expect(table.foreignKeys[0]).to.not.eq(undefined);
    expect(table.foreignKeys[0]).to.deep.include({
      name: _constraintNames.foreignKey,
      columns: ['id', 'child'],
      references: {
        table: _childTable,
        columns: ['parent', 'id'],
      },
      onUpdate: 'RESTRICT',
      onDelete: 'CASCADE',
    });

    if (isPostgres) {
      expect(table.checks[0]).to.not.eq(undefined);
      expect(table.checks[0].name).to.be.eq(_constraintNames.check);
      expect(table.checks[0].condition).to.be.an('string');
    }
  });

  if (isPostgres) {
    before(() => {
      return _query(metalize._client, [
        `drop sequence if exists ${_sequence};`,
        `create sequence ${_sequence} start with 100 increment by 1 minvalue 100 maxvalue 9999 cycle;`,
      ]);
    });
    after(async () => {
      await _query(metalize._client, [`drop sequence if exists ${_sequence};`]);
    });
    it(`${prefix}reading sequences`, async () => {
      const result = await metalize.read({ sequences: [_sequence] });
      const sequence = result.sequences.get(_sequence);

      expect(sequence).to.include({
        start: '100',
        min: '100',
        max: '9999',
        increment: '1',
        cycle: true,
      });
    });
  }

  onGotAdditionalBlocks(metalize);

  after(() => metalize.endConnection());
};
