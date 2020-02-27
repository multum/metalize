# Methods {docsify-ignore-all}

## `read({ ['tables' | 'sequences']: String[] })`

- Returns: `Promise<{ ['tables' | 'sequences']: Map<String, Metadata | undefined> }>`

> see [table metadata](metadata/table.md) and [sequence metadata](metadata/sequence.md)

Getting the metadata of an existing objects

## `end()`

- Returns: `Promise<void>`

Closing database connection
