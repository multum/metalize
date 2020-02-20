/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../../../helpers');

exports.getConstraints = tables => {
  tables = tables.map(n => `'${helpers.quoteName(n)}'::regclass`);
  return `
${exports.publicSearchPath()};
select
  conname as name,
  c.contype as type,
  pg_catalog.pg_get_constraintdef(c.oid, true) as definition,
  n.nspname || '.' || cl.relname as table
from pg_catalog.pg_constraint as c
  join pg_catalog.pg_class cl on cl.oid = c.conrelid
  join pg_catalog.pg_namespace n on n.oid = cl.relnamespace
where c.conrelid = any(array[${tables.join(', ')}])
order by 1;
${exports.resetSearchPath()};
`;
};

exports.getColumns = tables => `
select
  n.nspname || '.' ||  t.relname as table,
  pg_catalog.format_type(c.atttypid, c.atttypmod) as type_string,
  ic.data_type,
  ic.collation_name,
  ic.column_default,
  ic.is_nullable,
  ic.column_name,
  ic.numeric_precision,
  ic.numeric_scale,
  ic.interval_precision,
  ic.datetime_precision,
  ic.character_maximum_length
from pg_attribute c
join pg_class t on c.attrelid = t.oid
join pg_namespace n on t.relnamespace = n.oid
join information_schema.columns ic
  on c.attname = ic.column_name
  and t.relname = ic.table_name
  and n.nspname = ic.table_schema
where n.nspname || '.' ||  t.relname = ${helpers.sqlAnyName(tables)};
`;

exports.getIndexes = tables => `
select
  schemaname || '.' || tablename as table, 
  indexname as name,
  indexdef as definition
from pg_indexes as i
where schemaname || '.' || tablename = ${helpers.sqlAnyName(tables)}
  and indexname not in (select conname from pg_catalog.pg_constraint);
`;

exports.publicSearchPath = () => 'set search_path to public';
exports.resetSearchPath = () => 'set search_path to default';

exports.tableExist = table => `
select exists (
  select 1 from pg_tables where schemaname || '.' || tablename = '${table}'
)
`;
