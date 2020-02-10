/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../../../helpers');
const EXTENSIONS = require('../constants/extensions');

exports.columns = columns => {
  return columns.map(column => {
    const {
      column_name: name,
      is_nullable: nullable,
      data_type: type,
      column_default: defaultValue,
      collation_name: collate,
    } = column;
    return {
      name,
      type: type,
      default: defaultValue,
      nullable: nullable === 'YES',
      collate: collate,
    };
  });
};

exports.extensionDefinitions = definitions => {
  return definitions.map(({ name, definition, type }) => {
    switch (type) {
      case 'p':
        type = 'primaryKey';
        break;
      case 'f':
        type = 'foreignKey';
        break;
      case 'u':
        type = 'unique';
        break;
      case 'c':
        type = 'check';
        break;
    }
    return { name, type, ..._extensionDefinition(type, definition) };
  });
};

exports.indexDefinitions = definitions =>
  definitions.map(({ name, definition }) => ({
    name,
    ..._extensionDefinition('index', definition),
  }));

const _extensionDefinition = (type, definition) => {
  switch (type) {
    /**
     * example foreignKey definition
     * FOREIGN KEY (id, code) REFERENCES table_name(id, code)
     */
    case 'foreignKey': {
      const DEFAULTS = EXTENSIONS.FOREIGN_KEY_DEFAULTS;

      const [columns, referenceColumns] = definition
        .match(/[^(]+(?=\))/g)
        .map(matches => helpers.removeQuotes(matches).split(', '));
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
      return { columns: helpers.removeQuotes(columns).split(', ') };
    }

    /**
     * example index definition
     * CREATE UNIQUE INDEX index_name ON table_name USING btree (code)
     */
    case 'index': {
      const columns = definition.match(/\bUSING.*\((.*)\)/)[1];
      return { columns: helpers.removeQuotes(columns).split(', ') };
    }

    /**
     * example check definition
     * CHECK (a < b)
     */
    case 'check': {
      return { condition: definition.match(/[^(]+(?=\))/)[0] };
    }
  }
};
