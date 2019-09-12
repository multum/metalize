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
const helpers = require('../../../helpers');

class TableReader {
  constructor(metalize, options) {
    this.metalize = metalize;
    this.names = options.names.map(helpers.normalizeName);
  }

  getColumns() {
    return this.metalize._client
      .query(queries.getColumns(this.names))
      .then(utils.get('rows'))
      .then(utils.groupBy(utils.get('table')))
      .then(utils.mapObject(parser.columns));
  }

  getConstraints() {
    return this.metalize._client
      .query(queries.getConstraints(this.names))
      .then(utils.get('[1].rows')) // `1` is the result of executing sql-query to get constraints
      .then(utils.groupBy(utils.get('table')))
      .then(
        utils.mapObject(
          utils.pipe(
            parser.extensionDefinitions,
            utils.groupBy(utils.get('type'))
          )
        )
      );
  }

  getIndexes() {
    return this.metalize._client
      .query(queries.getIndexes(this.names))
      .then(utils.get('rows'))
      .then(parser.indexDefinitions)
      .then(utils.groupBy(utils.get('table')));
  }

  async read() {
    const [columns, constraints, indexes] = await Promise.all([
      this.getColumns(),
      this.getConstraints(),
      this.getIndexes(),
    ]);
    return this.names.reduce((acc, table) => {
      acc[table] = columns[table][0]
        ? {
            columns: columns[table] || [],
            primaryKey: utils.get([table, 'primaryKey', 0], constraints),
            foreignKeys: utils.get([table, 'foreignKey'], constraints) || [],
            unique: utils.get([table, 'unique'], constraints) || [],
            checks: utils.get([table, 'check'], constraints) || [],
            indexes: indexes[table] || [],
          }
        : undefined;
      return acc;
    }, {});
  }
}

module.exports = TableReader;
