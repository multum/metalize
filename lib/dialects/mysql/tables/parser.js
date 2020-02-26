/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../../utils');

exports.columns = columns => {
  return columns.map(column => {
    const {
      column_name,
      column_type,
      data_type,
      is_nullable,
      column_default,
      numeric_precision,
      numeric_scale,
      datetime_precision,
      character_maximum_length,
      auto_increment,
    } = column;

    column = {
      name: column_name,
      type: column_type,
      default: column_default,
      nullable: is_nullable === 'YES',
      identity: auto_increment === 'YES',
      details: { type: data_type },
    };

    if (utils.exists(datetime_precision)) {
      column.details.precision = datetime_precision;
    } else if (utils.exists(character_maximum_length)) {
      column.details.length = character_maximum_length;
    } else if (utils.exists(numeric_precision) || utils.exists(numeric_scale)) {
      column.details.precision = numeric_precision;
      column.details.scale = numeric_scale;
    }

    return column;
  });
};

const _groupByColumnName = (nameColumn, positionColumn, array) => {
  const groupedByName = utils.group(nameColumn, array);

  return Object.values(groupedByName).map(
    utils.sortBy(utils.get(positionColumn))
  );
};

exports.indexes = indexes => {
  return _groupByColumnName('index_name', 'seq_in_index', indexes).map(
    indexChunks => {
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
    }
  );
};

exports.constraintType = name => {
  switch (name) {
    case 'PRIMARY KEY':
      return 'primaryKey';
    case 'FOREIGN KEY':
      return 'foreignKey';
    case 'UNIQUE':
      return 'unique';
    // case 'CHECK':
    //   return 'check';
  }
};

const _getForeignKeyProperties = constraint => {
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

exports.constraints = constraints => {
  return _groupByColumnName(
    'constraint_name',
    'ordinal_position',
    constraints
  ).map(constraintChunks => {
    return constraintChunks.reduce((constraint, chunk) => {
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
          type: exports.constraintType(constraint_type),
          columns: [column_name],
          ..._getForeignKeyProperties(chunk),
        };
      }
    }, null);
  });
};
