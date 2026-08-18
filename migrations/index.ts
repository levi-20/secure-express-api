import path from 'node:path';
import { Client } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import config from '../src/config/config'

const executeMigrations = async () => {

  const client = new Client({
    connectionString: config.database.url
  });

  try {

    await client.connect()

    const db = drizzle(client)

    await migrate(db, {
      migrationsFolder: path.join(import.meta.dirname, "./db")
    })
  }
  finally {

    await client.end()
  }

}


executeMigrations().catch((error) => {
  console.error("Migration failed 🚨:", error);
  process.exit(1);
});