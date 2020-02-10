'use strict';

const { expect } = require('chai');
const Metalize = require('../lib');
const helpers = require('../lib/dialects/postgres/helpers');

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
  const quote = isPostgres ? helpers.quoteName : n => n;

  const table = schema ? `${schema}.metalize_users` : 'metalize_users';
  const childTable = table + '_child';
  const sequence = table + '_seq';

  const quotedTable = quote(table);
  const quotedChildTable = quote(childTable);
  const quotedSequence = quote(sequence);

  const _constraintNames = {
    check: `metalize_check_constraint`,
    foreignKey: `metalize_foreign_key_constraint`,
    unique: `metalize_unique_constraint`,
  };

  prefix = prefix ? `[ ${prefix} ] ` : '';

  const metalize = new Metalize({ dialect, connectionConfig });

  before(() => {
    return _query(metalize._client, [
      schema ? `create schema if not exists "${schema}";` : null,
      `drop table if exists ${quotedTable};`,
      `drop table if exists ${quotedChildTable};`,
      `create table ${quotedChildTable} (
          id bigint primary key,
          name varchar(255),
          parent bigint,
          unique (parent, id)
        );`,
      `create table ${quotedTable} (
          id bigint primary key,
          name varchar(255),
          age smallint,
          child bigint,
          constraint ${_constraintNames.foreignKey} foreign key (id, child)
            references ${quotedChildTable} (parent, id) on update restrict on delete cascade,
          constraint ${_constraintNames.unique} unique (name, age)
        );`,
      `create index index_name on ${quotedTable} (id, child);`,
      isPostgres
        ? `alter table ${quotedTable} add constraint ${_constraintNames.check} check (age > 21)`
        : null,
    ]);
  });

  after(() => {
    return _query(metalize._client, [
      `drop table if exists ${quotedTable};`,
      `drop table if exists ${quotedChildTable};`,
    ]);
  });

  it(`${prefix}reading tables`, async () => {
    const result = await metalize.read({ tables: [table] });
    const _table = result.tables.get(table);

    expect(_table.primaryKey).to.not.eq(undefined);
    expect(_table.primaryKey.name).to.be.an('string');
    expect(_table.primaryKey).to.deep.include({
      columns: ['id'],
    });
    expect(_table.columns).to.have.lengthOf(4);

    expect(_table.foreignKeys[0]).to.not.eq(undefined);
    expect(_table.foreignKeys[0]).to.deep.include({
      name: _constraintNames.foreignKey,
      columns: ['id', 'child'],
      references: {
        table: childTable,
        columns: ['parent', 'id'],
      },
      onUpdate: 'RESTRICT',
      onDelete: 'CASCADE',
    });

    if (isPostgres) {
      expect(_table.checks[0]).to.not.eq(undefined);
      expect(_table.checks[0].name).to.be.eq(_constraintNames.check);
      expect(_table.checks[0].condition).to.be.an('string');
    }
  });

  if (isPostgres) {
    before(() => {
      return _query(metalize._client, [
        `drop sequence if exists ${quotedSequence};`,
        `create sequence ${quotedSequence} start with 100 increment by 1 minvalue 100 maxvalue 9999 cycle;`,
      ]);
    });
    after(async () => {
      await _query(metalize._client, [
        `drop sequence if exists ${quotedSequence};`,
      ]);
    });
    it(`${prefix}reading sequences`, async () => {
      const result = await metalize.read({ sequences: [sequence] });
      const _sequence = result.sequences.get(sequence);

      expect(_sequence).to.include({
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
