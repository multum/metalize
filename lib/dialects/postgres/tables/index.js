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

  getColumns(names) {
    return this.metalize._client
      .query(queries.getColumns(names))
      .then(utils.get('rows'))
      .then(utils.group('table'))
      .then(utils.map(parser.columns));
  }

  getConstraints(names) {
    return this.metalize._client
      .query(queries.getConstraints(names))
      .then(utils.get('[1].rows')) // `1` is the result of executing sql-query to get constraints
      .then(utils.group('table'))
      .then(
        utils.map(
          utils.pipe(
            parser.extensionDefinitions,
            utils.cleanableGroup('type')
          )
        )
      );
  }

  getIndexes(names) {
    return this.metalize._client
      .query(queries.getIndexes(names))
      .then(utils.get('rows'))
      .then(utils.group('table'))
      .then(utils.map(parser.indexDefinitions));
  }

  async filterExistingTables() {
    const exists = await Promise.all(
      this.names.map(name =>
        this.metalize._client.query(queries.tableExist(name))
      )
    );
    return this.names.filter((_, index) =>
      utils.get([index, 'rows', 0, 'exists'], exists)
    );
  }

  async read() {
    const names = await this.filterExistingTables();
    if (names.length === 0) {
      return new Map();
    }
    const [columns, constraints, indexes] = await Promise.all([
      this.getColumns(names),
      this.getConstraints(names),
      this.getIndexes(names),
    ]);

    return names.reduce((acc, name) => {
      return acc.set(name, {
        name,
        columns: columns[name],
        primaryKey: utils.get([name, 'primaryKey', 0], constraints),
        foreignKeys: utils.get([name, 'foreignKey'], constraints) || [],
        unique: utils.get([name, 'unique'], constraints) || [],
        checks: utils.get([name, 'check'], constraints) || [],
        indexes: indexes[name] || [],
      });
    }, new Map());
  }
}

module.exports = TableReader;
