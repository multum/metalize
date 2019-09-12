# *metalize*

Node.js tool for easy work with database metadata

![](https://img.shields.io/travis/com/av-dev/metalize.svg?style=flat-square)
![](https://img.shields.io/npm/l/metalize.svg?style=flat-square)
![](https://img.shields.io/npm/v/metalize.svg?style=flat-square)
<!-- ![](https://img.shields.io/codecov/c/github/av-dev/metalize.svg?style=flat-square) -->

## Getting started with Postgres

**metalize** requires:
  - **[Node.js](https://nodejs.org)** **v8.10** or more
  - **[node-postgres](https://github.com/brianc/node-postgres)** **v7.0** or more
  - **[PostgreSQL Core](https://www.postgresql.org/download)** **v9.2** or more

```bash
npm install metalize pg
```

```javascript
const Metalize = require('metalize');

const metalize = new Metalize({ dialect: 'postgres' });

const tables = await metalize.read.tables(['public.users', 'public.events']);
console.log(tables);
/**
{
  'public.users': {
      columns: [ ... ],
      primaryKey: { ... } } },
      foreignKeys: [ ... ],
      unique: [ ... ],
      indexes: [ ... ]
  },
  'public.events': { ... }
}
*/

const sequences = await metalize.read.sequences(['public.users_seq']);
console.log(sequences);
/**
{
  'public.users_seq': {
      start: '1',
      min: '1',
      max: '9999',
      increment: '1',
      cycle: true,
  }
}
*/
```

## Documentation

<!-- You can find the documentation [on the website](https://av-dev.github.io/metalize/#/) -->

> The documentation is not ready yet

## Contributing

#### Issue

Suggestions for introducing new features, bug reports, and any other suggestions can be written in the issue. They will be reviewed immediately.

#### Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for **metalize**. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## License

**metalize** is open source software [licensed as MIT](https://github.com/av-dev/metalize/blob/master/LICENSE).
