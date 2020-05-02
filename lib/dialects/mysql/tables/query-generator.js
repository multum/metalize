/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../helpers');

exports.getColumns = (tables) => {
  const inArray = helpers.inArrayOfNamesSQL(tables);
  return `
select 
  concat(table_schema, '.', table_name) as "table",
  column_name,
  column_default,
  is_nullable,
  column_type,
  case when extra = "auto_increment" then "YES" else "NO" end as auto_increment
from information_schema.columns
where concat(table_schema, '.', table_name) ${inArray}
order by ordinal_position;
`;
};

exports.getConstraints = (tables) => {
  const inArray = helpers.inArrayOfNamesSQL(tables);
  return `
select
  concat(tc.table_schema, '.', tc.table_name) as "table",
  tc.constraint_name,
  constraint_type,
  column_name,
  referenced_table_schema,
  kcu.referenced_table_name,
  referenced_column_name,
  referenced_column_name,
  rc.match_option,
  rc.update_rule,
  rc.delete_rule
from information_schema.table_constraints as tc
left join information_schema.key_column_usage as kcu
    on kcu.constraint_name = tc.constraint_name
      and kcu.table_schema = tc.table_schema
      and kcu.table_name = tc.table_name
left join information_schema.referential_constraints as rc
    on kcu.constraint_name = rc.constraint_name
      and kcu.table_schema = rc.constraint_schema
      and kcu.table_name = rc.table_name
where concat(tc.table_schema, '.', tc.table_name) ${inArray}
order by tc.constraint_name, ordinal_position;
`;
};

exports.getIndexes = (tables) => {
  const inArray = helpers.inArrayOfNamesSQL(tables);
  return `
select 
  concat(table_schema, '.', table_name) as "table",
  index_name,
  seq_in_index,
  column_name
from information_schema.statistics
where non_unique = 1 and concat(table_schema, '.', table_name) ${inArray}
order by index_name, seq_in_index;
`;
};

exports.getExistingTables = (tables) => {
  const inArray = helpers.inArrayOfNamesSQL(tables);
  return `
select
  concat(table_schema, '.', table_name) as "name"
from information_schema.tables
where concat(table_schema, '.', table_name) ${inArray}
`;
};
