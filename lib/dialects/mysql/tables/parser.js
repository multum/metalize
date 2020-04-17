/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../../utils');
const CommonHelpers = require('../../common/helpers');

exports.columns = (columns) => {
  return columns.map((column) => {
    const {
      column_name,
      column_type,
      is_nullable,
      column_default,
      auto_increment,
    } = column;

    column = {
      name: column_name,
      type: column_type,
      default: column_default,
      nullable: is_nullable === 'YES',
      identity: auto_increment === 'YES',
    };

    if (
      /^smallint|mediumint|int|bigint/i.test(column.type) &&
      column.type.indexOf('zerofill') === -1
    ) {
      /**
       * Removing unnecessary parameter for integers in older versions of `mysql`
       * @example `bigint(20)` => `bigint`
       * @example `bigint(20) zerofill` => `bigint(20) zerofill`
       */
      column.type = column.type.replace(/\(.*\)/, '');
    }

    return column;
  });
};

exports.indexes = utils.pipe(
  utils.group('index_name'),
  (indexes) => Object.values(indexes),
  utils.map((indexChunks) => {
    return indexChunks.reduce((index, chunk) => {
      const { column_name, index_name } = chunk;
      if (index) {
        index.columns.push(column_name);
        return index;
      }
      return {
        name: index_name,
        columns: [column_name],
      };
    }, null);
  })
);

const _constraintSchemaTypes = {
  'PRIMARY KEY': 'primaryKey',
  'FOREIGN KEY': 'foreignKey',
  UNIQUE: 'unique',
};

const _getForeignKeyProperties = (constraint) => {
  if (constraint['referenced_column_name']) {
    const {
      referenced_table_schema,
      referenced_table_name,
      referenced_column_name,
      match_option,
      update_rule,
      delete_rule,
    } = constraint;
    return {
      references: {
        table: `${referenced_table_schema}.${referenced_table_name}`,
        columns: [referenced_column_name],
      },
      match: match_option,
      onUpdate: update_rule,
      onDelete: delete_rule,
    };
  }
};

const concatConstraintChunks = (chunks) => {
  return chunks.reduce((constraint, chunk) => {
    const {
      column_name,
      constraint_name,
      constraint_type,
      referenced_column_name,
    } = chunk;
    if (constraint) {
      constraint.columns.push(column_name);
      if (constraint.references) {
        constraint.references.columns.push(referenced_column_name);
      }
      return constraint;
    } else {
      return {
        name: constraint_name,
        type: _constraintSchemaTypes[constraint_type],
        columns: [column_name],
        ..._getForeignKeyProperties(chunk),
      };
    }
  }, null);
};

exports.constraints = (constraints) => {
  constraints = utils.group('constraint_name', constraints);
  return Object.values(constraints).reduce((acc, chunks) => {
    const constraint = concatConstraintChunks(chunks);
    const { type } = constraint;
    delete constraint.type;
    return CommonHelpers.moveConstraintToGroup(acc, type, constraint);
  }, {});
};
