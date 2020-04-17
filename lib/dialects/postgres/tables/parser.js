/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../helpers');
const CommonHelpers = require('../../common/helpers');

const FOREIGN_KEY_DEFAULTS = {
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  match: 'SIMPLE',
};

exports.columns = (columns) => {
  return columns.map((column) => {
    const {
      column_name,
      is_nullable,
      data_type,
      column_default,
      collation_name,
      is_identity,
      identity_generation,
      identity_start,
      identity_increment,
      identity_minimum,
      identity_maximum,
      identity_cycle,
    } = column;

    column = {
      type: data_type,
      name: column_name,
      default: column_default,
      nullable: is_nullable === 'YES',
      collate: collation_name,
    };

    if (is_identity === 'YES') {
      column.identity = {
        generation: identity_generation,
        start: identity_start,
        increment: identity_increment,
        min: identity_minimum,
        max: identity_maximum,
        cycle: identity_cycle === 'YES',
      };
    } else if (is_identity === 'NO') {
      column.identity = null;
    }

    return column;
  });
};

const _constraintSchemaTypes = {
  p: 'primaryKey',
  f: 'foreignKey',
  u: 'unique',
  c: 'check',
};

exports.constraints = (definitions) => {
  return definitions.reduce((acc, { name, definition, type }) => {
    type = _constraintSchemaTypes[type];
    const constraint = _parseConstraintOrIndex(type, name, definition);
    return CommonHelpers.moveConstraintToGroup(acc, type, constraint);
  }, {});
};

exports.indexes = (definitions) => {
  return definitions.map(({ name, definition }) => {
    return _parseConstraintOrIndex('index', name, definition);
  });
};

const _parseConstraintOrIndex = (type, name, definition) => {
  switch (type) {
    /**
     * example foreignKey definition
     * FOREIGN KEY (id, code) REFERENCES table_name(id, code)
     */
    case 'foreignKey': {
      const DEFAULTS = FOREIGN_KEY_DEFAULTS;

      const [columns, referenceColumns] = definition
        .match(/[^(]+(?=\))/g)
        .map((matches) => helpers.removeQuotes(matches).split(', '));
      const table = definition.match(/\bREFERENCES(.*)\(/i)[1].trim();

      let match = definition.match(/\bMATCH (FULL|SIMPLE|PARTIAL)/);
      match = match ? match[1].trim() : DEFAULTS.match;

      let onDelete = definition.match(
        /\bON DELETE (CASCADE|RESTRICT|NO ACTION)/
      );
      onDelete = onDelete ? onDelete[1].trim() : DEFAULTS.onDelete;

      let onUpdate = definition.match(
        /\bON UPDATE (CASCADE|RESTRICT|NO ACTION)/
      );
      onUpdate = onUpdate ? onUpdate[1].trim() : DEFAULTS.onUpdate;

      return {
        name,
        columns,
        references: {
          table: helpers.normalizeName(table),
          columns: referenceColumns,
        },
        onDelete,
        onUpdate,
        match,
      };
    }

    /**
     * example unique and primaryKey definitions
     * UNIQUE (code)
     * PRIMARY KEY (code)
     */
    case 'unique':
    case 'primaryKey': {
      const columns = definition.match(/[^(]+(?=\))/)[0];
      return { name, columns: helpers.removeQuotes(columns).split(', ') };
    }

    /**
     * example index definition
     * CREATE UNIQUE INDEX index_name ON table_name USING btree (code)
     */
    case 'index': {
      const columns = definition.match(/\bUSING.*\((.*)\)/)[1];
      return { name, columns: helpers.removeQuotes(columns).split(', ') };
    }

    /**
     * example check definition
     * CHECK (a < b)
     */
    case 'check': {
      return { name, condition: definition.match(/[^(]+(?=\))/)[0] };
    }
  }
};
