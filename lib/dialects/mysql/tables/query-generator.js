/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../helpers');

exports.getColumns = tables => {
  const inTables = helpers.inArrayOfNamesSQL(tables);
  return `
select 
  concat(table_schema, '.', table_name) as "table",
  column_name,
  column_default,
  is_nullable,
  data_type,
  column_type,
  numeric_precision,
  numeric_scale,
  datetime_precision,
  character_maximum_length
from information_schema.columns
  where concat(table_schema, '.', table_name) ${inTables}
`;
};

exports.getConstraints = tables => {
  const inTables = helpers.inArrayOfNamesSQL(tables);
  return `
select
  concat(tc.table_schema, '.', tc.table_name) as "table",
  tc.constraint_name,
  constraint_type,
  column_name,
  ordinal_position,
  referenced_table_schema,
  kcu.referenced_table_name,
  referenced_column_name,
  referenced_column_name,
  match_option,
  update_rule,
  delete_rule
from information_schema.table_constraints as tc
left join information_schema.key_column_usage as kcu
    on kcu.CONSTRAINT_NAME = tc.constraint_name
      and kcu.table_schema = tc.table_schema
      and kcu.table_name = tc.table_name
left join information_schema.referential_constraints as rc
    on kcu.constraint_name = rc.constraint_name
      and kcu.table_schema = rc.constraint_schema
      and kcu.table_name = rc.table_name
  where concat(tc.table_schema, '.', tc.table_name) ${inTables};
`;
};

exports.getIndexes = tables => {
  const inTables = helpers.inArrayOfNamesSQL(tables);
  return `
select 
  concat(table_schema, '.', table_name) as "table",
  index_name,
  seq_in_index,
  column_name
from information_schema.statistics
  where non_unique = 1 and concat(table_schema, '.', table_name) ${inTables}
`;
};
