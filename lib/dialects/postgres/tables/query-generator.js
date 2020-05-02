/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../helpers');

exports.getConstraints = (tables) => {
  tables = tables.map((n) => `'${helpers.quoteObjectName(n)}'`);
  return `
select
  conname as name,
  c.contype as type,
  n1.nspname || '.' || t1.relname as table,
  n2.nspname || '.' || t2.relname as referenced_table,
  pg_catalog.pg_get_constraintdef(c.oid, true) as definition
from pg_catalog.pg_constraint as c
  join pg_catalog.pg_class t1 on t1.oid = c.conrelid
  join pg_catalog.pg_namespace n1 on n1.oid = t1.relnamespace
  left join pg_class t2 on t2.oid = c.confrelid
  left join pg_catalog.pg_namespace n2 on n2.oid = t2.relnamespace
where c.conrelid = any(array[${tables.join(', ')}]::regclass[])
order by name;
`;
};

exports.getColumns = (tables) => `
select
  n.nspname || '.' ||  t.relname as table,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type,
  ic.collation_name,
  ic.column_default,
  ic.is_nullable,
  ic.column_name,
  ic.is_identity,
  ic.identity_generation,
  ic.identity_start,
  ic.identity_increment,
  ic.identity_minimum,
  ic.identity_maximum,
  ic.identity_cycle
from pg_attribute a
join pg_class t on a.attrelid = t.oid
join pg_namespace n on t.relnamespace = n.oid
join information_schema.columns ic
  on a.attname = ic.column_name
  and t.relname = ic.table_name
  and n.nspname = ic.table_schema
where n.nspname || '.' ||  t.relname = ${helpers.anyNamesSQL(tables)}
order by ic.ordinal_position
`;

exports.getIndexes = (tables) => `
select
  schemaname || '.' || tablename as table, 
  indexname as name,
  indexdef as definition
from pg_indexes as i
where schemaname || '.' || tablename = ${helpers.anyNamesSQL(tables)}
  and indexname not in (select conname from pg_catalog.pg_constraint)
order by name;
`;

exports.getExistingTables = (tables) => `
select
  schemaname || '.' || tablename as name
from pg_tables
where schemaname || '.' || tablename = ${helpers.anyNamesSQL(tables)};
`;
