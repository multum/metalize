<br>
<p align='center'><img src='https://av-dev.github.io/metalize/logo.svg' alt='metalize'></p>
<br>
<p align='center'>Node.js tool for easy reading <strong>database metadata</strong></p>
<p align='center'>
    <img src='https://img.shields.io/travis/com/av-dev/metalize.svg?style=flat-square' alt='build'>
    <img src='https://img.shields.io/npm/l/metalize.svg?style=flat-square' alt='license'>
    <img src='https://img.shields.io/npm/v/metalize.svg?style=flat-square' alt='version'>
    <img src='https://img.shields.io/codecov/c/github/av-dev/metalize.svg?style=flat-square' alt='coverage'>
</p>
<br>

## Getting started with MySQL

#### Requires:

- **[Node.js](https://nodejs.org)** **v8.10** or more
- **[MySql server](https://dev.mysql.com/downloads/mysql/)** **v5.6** or more
- **[node-mysql2](https://github.com/sidorares/node-mysql2)**

```bash
npm install metalize mysql2
```

```javascript
const Metalize = require('metalize');

const metalize = new Metalize({
  dialect: 'mysql',
  connectionConfig: {
    host: '127.0.0.1',
    user: 'root',
    database: 'mysql',
    port: 3306,
  },
});

const tables = await metalize.read.tables(['mysql.users', 'mysql.events']);
console.log(tables);
/**
{
  'users': {
      columns: [ ... ],
  },
  'events': { ... }
}
*/
```

## Getting started with PostgreSQL

#### Requires:

- **[Node.js](https://nodejs.org)** **v8.10** or more
- **[PostgreSQL server](https://www.postgresql.org/download)** **v9.2** or more
- **[node-postgres](https://github.com/brianc/node-postgres)**

```bash
npm install metalize pg
```

```javascript
const Metalize = require('metalize');

const metalize = new Metalize({
  dialect: 'postgres',
  connectionConfig: {
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  },
});

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

## Contributing

#### Issue

Suggestions for introducing new features, bug reports, and any other suggestions can be written in the issue. They will be reviewed immediately.

#### Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for **metalize**. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## License

**metalize** is open source software [licensed as MIT](https://github.com/av-dev/metalize/blob/master/LICENSE).
