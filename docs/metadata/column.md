# Column

## name

- Type: `String`

Column name

## type.name

- Type: `String`

> Examples: `'numeric', 'character varying'`

Type name(without modifier type) 

## type.raw

- Type: `String`

> Examples: `'numeric(16, 2)', 'character varying(255)'`
>
SQL name of a data type(possibly with a modifier type)

## type.precision

***(date | numeric) types***

- Type: `Number`

## type.scale

***numeric types***

- Type: `Number`

## type.length

***character types***

- Type: `Number`

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
