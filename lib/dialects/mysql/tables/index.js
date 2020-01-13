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
  static getColumns(metalize, names) {
    return metalize._client
      .query(queries.getColumns(names))
      .then(utils.group('table'))
      .then(utils.map(parser.columns));
  }

  static getConstraints(metalize, names) {
    return metalize._client
      .query(queries.getConstraints(names))
      .then(utils.group('table'))
      .then(
        utils.map(utils.pipe(parser.constraints, utils.cleanableGroup('type')))
      );
  }

  static getIndexes(metalize, names) {
    return metalize._client
      .query(queries.getIndexes(names))
      .then(utils.group('table'))
      .then(utils.map(parser.indexes));
  }

  static async read(metalize, names) {
    const [columns, constraints, indexes] = await Promise.all([
      TableReader.getColumns(metalize, names),
      TableReader.getConstraints(metalize, names),
      TableReader.getIndexes(metalize, names),
    ]);
    return names.reduce((acc, name) => {
      const structure = utils.get([name, 0], columns)
        ? {
            name,
            columns: columns[name],
            primaryKey: utils.get([name, 'primaryKey', 0], constraints),
            foreignKeys: utils.get([name, 'foreignKey'], constraints) || [],
            unique: utils.get([name, 'unique'], constraints) || [],
            indexes: indexes[name] || [],
            /**
             * TODO: CHECK constraint not supported in versions below 8.0.16.
             * Need to add support for newer versions
             * Details: https://dev.mysql.com/doc/refman/8.0/en/check-constraints-table.html
             * checks: utils.get([table, 'check'], constraints) || [],
             */
          }
        : undefined;
      return acc.set(name, structure);
    }, new Map());
  }
}

module.exports = TableReader;
