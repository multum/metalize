/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const queries = require('./queries');
const parser = require('./parser');
const utils = require('../../../utils');

class TableReader {
  constructor(metalize, options) {
    this.metalize = metalize;
    this.names = options.names;
  }

  getColumns() {
    return this.metalize._client
      .query(queries.getColumns(this.names))
      .then(utils.group('table'))
      .then(utils.map(parser.columns));
  }

  getConstraints() {
    return this.metalize._client
      .query(queries.getConstraints(this.names))
      .then(utils.group('table'))
      .then(
        utils.map(
          utils.pipe(
            parser.constraints,
            utils.cleanableGroup('type')
          )
        )
      );
  }

  getIndexes() {
    return this.metalize._client
      .query(queries.getIndexes(this.names))
      .then(utils.group('table'))
      .then(utils.map(parser.indexes));
  }

  async read() {
    const [columns, constraints, indexes] = await Promise.all([
      this.getColumns(),
      this.getConstraints(),
      this.getIndexes(),
    ]);
    return this.names.reduce((acc, table) => {
      acc[table] = utils.get([table, 0], columns)
        ? {
            columns: columns[table],
            primaryKey: utils.get([table, 'primaryKey', 0], constraints),
            foreignKeys: utils.get([table, 'foreignKey'], constraints) || [],
            unique: utils.get([table, 'unique'], constraints) || [],
            indexes: indexes[table] || [],
            /**
             * TODO: CHECK constraint not supported in versions below 8.0.16.
             * Need to add support for newer versions
             * Details: https://dev.mysql.com/doc/refman/8.0/en/check-constraints-table.html
             * checks: utils.get([table, 'check'], constraints) || [],
             */
          }
        : undefined;
      return acc;
    }, {});
  }
}

module.exports = TableReader;
