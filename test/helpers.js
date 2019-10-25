'use strict';

const { expect } = require('chai');
const Metalize = require('../lib');

exports.setup = ({
  schema,
  dialect,
  connectionConfig,
  onGotAdditionalBlocks = () => null,
}) => {
  const isPostgres = dialect === 'postgres';
  describe(`'${dialect}' dialect`, () => {
    const metalize = new Metalize({ dialect, connectionConfig });

    const _table = schema ? `${schema}.metalize_users` : 'metalize_users';
    const _childTable = _table + '_child';
    const _sequence = _table + '_seq';

    const _query = queries => {
      return queries.reduce(
        (acc, query) =>
          query ? acc.then(() => metalize._client.query(query)) : acc,
        Promise.resolve()
      );
    };

    before(() => {
      return _query([
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
          age smallint,
          child bigint,
          foreign key (id, child) references ${_childTable} (parent, id) on update restrict on delete cascade,
          unique (name, age)
        );`,
        `create index index_name on ${_table} (id, child);`,
      ]);
    });

    after(() => {
      return _query([`drop table if exists ${_table};`]);
    });

    it('reading tables', async () => {
      const tables = await metalize.read.tables([_table]);
      const table = tables.get(_table);

      expect(table.primaryKey).to.not.eq(undefined);
      expect(table.primaryKey).to.deep.include({
        columns: ['id'],
      });

      expect(table.columns).to.have.lengthOf(4);

      expect(table.foreignKeys[0]).to.not.eq(undefined);
      expect(table.foreignKeys[0]).to.deep.include({
        columns: ['id', 'child'],
        references: {
          table: _childTable,
          columns: ['parent', 'id'],
        },
        onUpdate: 'RESTRICT',
        onDelete: 'CASCADE',
      });
    });

    if (isPostgres) {
      before(() => {
        return _query([
          `drop sequence if exists ${_sequence};`,
          `create sequence ${_sequence} start with 100 increment by 1 minvalue 100 maxvalue 9999 cycle;`,
        ]);
      });
      after(async () => {
        await _query([`drop sequence if exists ${_sequence};`]);
      });
      it('reading sequences', async () => {
        const sequences = await metalize.read.sequences([_sequence]);
        const sequence = sequences.get(_sequence);

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
  });
};
