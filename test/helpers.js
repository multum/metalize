'use strict';

const Metalize = require('..');
const PostgresHelpers = require('../lib/dialects/postgres/helpers');

const queryQueue = async (client, queries) => {
  queries = queries.filter(Boolean);
  for (const query of queries) {
    await client.query(query);
  }
};

const getClient = async (dialect, config) => {
  if (dialect === 'postgres') {
    const { Client } = require('pg');
    const client = new Client(config);
    await client.connect();
    return client;
  } else if (dialect === 'mysql') {
    const lib = require('mysql2/promise');
    return lib.createConnection(config);
  }
};

exports.setup = ({
  schema,
  dialect,
  connectionConfig,
  onGotAdditionalBlocks = () => null,
}) => {
  const isPostgres = dialect === 'postgres';
  const quote = isPostgres ? PostgresHelpers.quoteObjectName : (n) => n;

  const schemaPrefix = schema ? `${schema}.` : '';

  const undefinedTable = schemaPrefix + 'undefined_table';
  const undefinedSequence = schemaPrefix + 'undefined_seq';

  const table = schemaPrefix + 'users';
  const childTable = table + '_child';
  const sequence = table + '_seq';

  const quotedTable = quote(table);
  const quotedChildTable = quote(childTable);
  const quotedSequence = quote(sequence);

  const constraintNames = {
    check: 'users_c_constraint',
    foreignKey: 'users_f_constraint',
    unique: 'users_u_constraint',
  };

  const metalize = new Metalize({ dialect, connectionConfig });

  let client;
  beforeAll(async () => {
    client = await getClient(dialect, connectionConfig);
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
          constraint ${constraintNames.foreignKey} foreign key (id, child)
            references ${quotedChildTable} (parent, id) on update restrict on delete cascade,
          constraint ${constraintNames.unique} unique (name, age)
        );`,
      `create index index_name on ${quotedTable} (id, child);`,
    ];

    if (isPostgres) {
      queries.push(
        `alter table ${quotedTable} add constraint ${constraintNames.check} check (age > 21)`,
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

    return queryQueue(client, queries);
  });

  it(`table metadata`, async function () {
    {
      const result = await metalize.find({ tables: [undefinedTable] });
      expect(result.tables).toHaveProperty('size', 1);
      expect(result.tables.get(undefinedTable)).toBeUndefined();
    }

    {
      const result = await metalize.find({ tables: [undefinedTable, table] });
      expect(result).toMatchSnapshot();
    }
  });

  if (isPostgres) {
    it(`sequence metadata`, async function () {
      {
        const result = await metalize.find({
          sequences: [undefinedSequence],
        });
        expect(result.sequences).toHaveProperty('size', 1);
        expect(result.sequences.get(undefinedSequence)).toBeUndefined();
      }
      {
        const result = await metalize.find({
          sequences: [undefinedSequence, sequence],
        });
        expect(result).toMatchSnapshot();
      }
    });
  }

  it('using external client', async function () {
    const result = await metalize.find({ tables: [table] }, { client });
    expect(result.tables.get(table)).toBeDefined();
    await client.query('select 1'); // connection check
  });

  onGotAdditionalBlocks(metalize);

  afterAll(async () => {
    if (schema) {
      await queryQueue(client, [
        isPostgres
          ? `drop schema if exists ${schema} cascade`
          : `drop schema if exists ${schema}`,
      ]);
    }
    return client.end();
  });
};
