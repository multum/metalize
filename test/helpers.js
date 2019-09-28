'use strict';

const { expect } = require('chai');
const Metalize = require('../lib');

exports.setup = ({ schema, dialect, connectionConfig }) => {
  const isPostgres = dialect === 'postgres';
  describe(`test '${dialect}' dialect`, () => {
    const metalize = new Metalize({ dialect, connectionConfig });

    const _table = schema ? `${schema}.metalize_users` : 'metalize_users';
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
        `create table ${_table} ( id bigint primary key, name varchar(255), age smallint);`,
      ]);
    });

    after(() => {
      return _query([`drop table if exists ${_table};`]);
    });

    it('reading tables', async () => {
      const tables = await metalize.read.tables([_table]);
      const table = tables[_table];
      expect(table.primaryKey).to.exist;
      expect(table.columns).to.have.lengthOf(3);
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
        const sequence = sequences[_sequence];

        expect(sequence).to.include({
          start: '100',
          min: '100',
          max: '9999',
          increment: '1',
          cycle: true,
        });
      });
    }
  });
};
