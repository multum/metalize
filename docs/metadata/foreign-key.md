# ForeignKey

## name

- Type: `string`

Constraint name

## columns

- Type: `string[]`

List of column names

## references

- Type: `object`

Object with foreign table parameters

## references.table

- Type: `string`

Foreign table name

## references.columns

- Type: `string[]`

Foreign table column names

## match

- Type: `string`

`SIMPLE`&#124;`FULL`&#124;`PARTIAL`

## onDelete

- Type: `string`

`CASCADE`&#124;`RESTRICT`&#124;`NO ACTION`

## onUpdate

- Type: `string`

`CASCADE`&#124;`RESTRICT`&#124;`NO ACTION`
