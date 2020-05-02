# ForeignKey

## name

- Type: `string`

Constraint name

## columns

- Type: `string[]`

List of column names

## references.table

- Type: `string`

Foreign table name

## references.columns

- Type: `string[]`

Foreign table column names

## match

- Type: `string`

  - MySQL: **always `SIMPLE`**
  - PostgreSQL: **`SIMPLE` &#124; `FULL` &#124; `PARTIAL`**

## onDelete

- Type: `string`

**`NO ACTION` &#124; `RESTRICT` &#124; `CASCADE` &#124; `SET NULL` &#124; `SET DEFAULT`**

## onUpdate

- Type: `string`

**`NO ACTION` &#124; `RESTRICT` &#124; `CASCADE` &#124; `SET NULL` &#124; `SET DEFAULT`**
