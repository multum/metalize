# ForeignKey

## name

- Type: `String`

Constraint name

## columns

- Type: `Array<String>`

List of column names

## references

- Type: `Object`

Object with foreign table parameters

## references.table

- Type: `String`

Foreign table name

## references.columns

- Type: `Array<String>`

Foreign table column names

## match

- Type: `String`

`SIMPLE`&#124;`FULL`&#124;`PARTIAL`

## onDelete

- Type: `String`

`CASCADE`&#124;`RESTRICT`&#124;`NO ACTION`

## onUpdate

- Type: `String`

`CASCADE`&#124;`RESTRICT`&#124;`NO ACTION`
