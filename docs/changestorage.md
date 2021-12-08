# Change storage
It is possible to replace the default storage which is a SQLite database by the system of your choice. 
To do this, you need to create a new type of ORM.
The code below is representative of an implementation via SQLite in memory.

```
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Inspired by https://dev.to/webeleon/unit-testing-nestjs-with-typeorm-in-memory-l6m
 */
export const TypeOrmSQLiteModule = () =>
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    autoLoadEntities: true, // https://docs.nestjs.com/techniques/database#auto-load-entities
    synchronize: true,
    keepConnectionAlive: true // https://github.com/nestjs/typeorm/issues/61
  });
```

The NestJs documentation proposes an implementation with mySQL https://docs.nestjs.com/techniques/database


