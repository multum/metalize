# Column

## name

- Type: `String`

Column name

## type

- Type: `String`

> Examples: `'bigint', 'numeric(16, 0)', 'character varying(255)'`

SQL data type

## default

- Type: `String`

Default value

## nullable

- Type: `Boolean`

The column nullability

## identity

!> `postgres` dialect requires version 10 or later

- Types:
  - PostgreSQL: `Object`
  - MySQL: `Boolean`

## identity.generation

- Type: `String`

`ALWAYS` &#124; `BY DEFAULT`

## [identity.[sequence option]](metadata/sequence.md)
