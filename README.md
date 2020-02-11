<br/>

![](https://multum.github.io/metalize/logo.svg)

Node.js tool for easy reading **database metadata**

![](https://img.shields.io/travis/com/multum/metalize.svg?style=flat-square)
![](https://img.shields.io/npm/l/metalize.svg?style=flat-square)
![](https://img.shields.io/npm/v/metalize.svg?style=flat-square)
![](https://img.shields.io/codecov/c/github/multum/metalize.svg?style=flat-square)

## Features

- **PostgreSQL** and **MySQL** dialects
- Reading **tables** (columns, indexes, primary keys, unique, foreign keys, checks)
- Reading **sequences** (start, max, min, cycle, increment)

## Documentation

You can find the documentation [on the website](https://multum.github.io/metalize/#/)

## Getting started with MySQL

#### Requires:

- **[Node.js](https://nodejs.org)** **v8.10** or more
- **[MySQL server](https://dev.mysql.com/downloads/mysql/)** **v5.6** or more
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
    database: 'public',
    port: 3306,
  },
});

metalize
  .read({ tables: ['public.users', 'public.events'] })
  .then(result => console.log(result.tables));

/**
Map {
  'public.users' => {
      columns: [ ... ],
      primaryKey: { ... },
      foreignKeys: [ ... ],
      unique: [ ... ],
      indexes: [ ... ]
  },
  'public.events' => { ... }
}
*/
```

## Getting started with PostgreSQL

#### Requires:

- **[Node.js](https://nodejs.org)** **v8.10** or more
- **[PostgreSQL server](https://www.postgresql.org/download)** **v9.5** or more
- **[node-postgres](https://github.com/brianc/node-postgres)** **v7.1** or more

> **Do not use quotes** in the name of the object. `metalize` automatically adds them when needed

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

metalize
  .read({ tables: ['public.users', 'public.events'] })
  .then(result => console.log(result.tables));

/**
Map {
  'public.users' => {
      columns: [ ... ],
      primaryKey: { ... },
      foreignKeys: [ ... ],
      unique: [ ... ],
      indexes: [ ... ],
      checks: [ ... ]
  },
  'public.events' => { ... }
}
*/

metalize
  .read({ sequences: ['public.usersSeq'] })
  .then(result => console.log(result.sequences));

/**
Map {
  'public.usersSeq' => {
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

**metalize** is open source software [licensed as MIT](https://github.com/multum/metalize/blob/master/LICENSE).
