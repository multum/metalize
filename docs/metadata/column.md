# Column

## name

- Type: `string`

Column name

## type

- Type: `string`

> Examples: `'bigint', 'numeric(16, 0)', 'character varying(255)'`

SQL data type

## default

- Type: `string`

Default value

## nullable

- Type: `boolean`

The column nullability

## identity

!> `postgres` dialect requires version 10 or later

- Types:
  - MySQL: `boolean`
  - PostgreSQL: `object`

## identity.generation

- Type: `string`

`ALWAYS` &#124; `BY DEFAULT`

## [identity.[sequence property]](metadata/sequence.md)

Sequence properties expect `name`
