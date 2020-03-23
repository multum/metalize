'use strict';

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
}) => {
  const isPostgres = dialect === 'postgres';
  const quote = isPostgres ? helpers.quoteObjectName : (n) => n;

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

  const metalize = new Metalize({ dialect, connectionConfig });

  beforeAll(() => {
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

  it(`table metadata`, function () {
    return expect(
      metalize.read({ tables: [table] })
    ).resolves.toMatchSnapshot();
  });

  if (isPostgres) {
    it(`sequence metadata`, function () {
      return expect(
        metalize.read({ sequences: [sequence] })
      ).resolves.toMatchSnapshot();
    });
  }

  onGotAdditionalBlocks(metalize);

  afterAll(async () => {
    if (schema) {
      await _query(metalize._client, [
        isPostgres
          ? `drop schema if exists ${schema} cascade`
          : `drop schema if exists ${schema}`,
      ]);
    }
    return metalize.end();
  });
};
