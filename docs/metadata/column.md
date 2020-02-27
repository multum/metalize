# Column

## name

- Type: `String`

Column name

## type

- Type: `String`

Type definition

## default

- Type: `String`

Default value

## nullable

- Type: `Boolean`

The column nullability

## details.type

- Type: `String`

Type name(without parameters)

## details.precision

***(date | numeric) types***

- Type: `Number`

## details.scale

***numeric types***

- Type: `Number`

## details.length

***character types***

- Type: `Number`

## identity
- Types:
    - PostgreSQL: `Object`
    - MySQL: `Boolean`
    
## identity.generation

- Type: `String`

`ALWAYS` &#124; `BY DEFAULT`

## [identity.[sequence option]](metadata/sequence.md)
