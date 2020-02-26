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

const _getTableColumn = (table, column) => {
  return table && table.columns.find(({ name }) => name === column);
};

exports.setup = ({
  schema,
  dialect,
  connectionConfig,
  onGotAdditionalBlocks = () => null,
}) => {
  const isPostgres = dialect === 'postgres';
  const quote = isPostgres ? helpers.quoteObjectName : n => n;

  const table = (schema ? `${schema}.` : '') + 'users';
  const childTable = table + '_child';
  const sequence = table + '_seq';

  const quotedTable = quote(table);
  const quotedChildTable = quote(childTable);
  const quotedSequence = quote(sequence);

  const _constraintNames = {
    check: 'users_c_constraint',
    foreignKey: 'users_f_constraint',
    unique: 'users_u_constraint',
  };

  const prefix = schema ? `[ ${schema} ] ` : '';

  const metalize = new Metalize({ dialect, connectionConfig });

  before(() => {
    const queries = [
      schema ? `create schema if not exists ${quote(schema)};` : null,
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
          name varchar(255) default 'noname',
          budget decimal(16, 3),
          age smallint not null,
          child bigint,
          constraint ${_constraintNames.foreignKey} foreign key (id, child)
            references ${quotedChildTable} (parent, id) on update restrict on delete cascade,
          constraint ${_constraintNames.unique} unique (name, age)
        );`,
      `create index index_name on ${quotedTable} (id, child);`,
    ];

    if (isPostgres) {
      queries.push(
        `alter table ${quotedTable} add constraint ${_constraintNames.check} check (age > 21)`,
        `alter table ${quotedTable} alter column age add generated always as identity ( start 100 minvalue 100 maxvalue 9999 no cycle increment 5 )`,
        `drop sequence if exists ${quotedSequence};`,
        `create sequence ${quotedSequence} start with 100 increment by 1 minvalue 100 maxvalue 9999 cycle;`
      );
    } else {
      queries.push(
        `create index age_index on ${quotedTable} (age);`,
        `alter table ${quotedTable} modify column age bigint auto_increment`
      );
    }

    return _query(metalize._client, queries);
  });

  it(`${prefix}reading tables`, async () => {
    const result = await metalize.read({ tables: [table] });
    const _table = result.tables.get(table);

    expect(_table.primaryKey).to.not.eq(undefined);
    expect(_table.primaryKey.name).to.be.an('string');
    expect(_table.primaryKey).to.deep.include({
      columns: ['id'],
    });

    expect(_table.columns).to.have.lengthOf(5);

    expect(_getTableColumn(_table, 'name')).to.deep.include({
      default: isPostgres ? "'noname'::character varying" : 'noname',
      details: {
        type: isPostgres ? 'character varying' : 'varchar',
        length: 255,
      },
    });

    expect(_getTableColumn(_table, 'budget')).to.deep.include({
      details: {
        type: isPostgres ? 'numeric' : 'decimal',
        precision: 16,
        scale: 3,
      },
    });

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

    const ageColumn = _getTableColumn(_table, 'age');
    expect(ageColumn).to.not.eq(undefined);
    if (isPostgres) {
      expect(ageColumn.identity).to.include({
        start: '100',
        min: '100',
        max: '9999',
        cycle: false,
      });
    } else {
      expect(ageColumn.identity).to.equal(true);
    }

    if (isPostgres) {
      expect(_table.checks[0]).to.not.eq(undefined);
      expect(_table.checks[0].name).to.be.eq(_constraintNames.check);
      expect(_table.checks[0].condition).to.be.an('string');
    }
  });

  if (isPostgres) {
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

  after(async () => {
    if (schema) {
      await _query(metalize._client, [
        isPostgres
          ? `drop schema if exists ${schema} cascade`
          : `drop schema if exists ${schema}`,
      ]);
    }
    return metalize.endConnection();
  });
};
