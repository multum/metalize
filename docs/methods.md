# Methods {docsify-ignore-all}

## find

> metalize.find(objects, options)

| Option              | Type       | Default | Required |
| ------------------- | ---------- | ------- | -------- |
| `objects`           | `object`   | `null`  | `true`   |
| `objects.tables`    | `string[]` | `[]`    | `false`  |
| `objects.sequences` | `string[]` | `[]`    | `false`  |
| `options`           | `object`   | `null`  | `false`  |
| `options.client`    | `object`   | `null`  | `false`  |

Returns: _Promise<[Result](result.md)>_

Getting the metadata of an existing objects
