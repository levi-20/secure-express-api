import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import config from '@/config.js'


const pool = new Pool({
  connectionString: config.database.url,
  max: config.database.pool.max,
  idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.pool.connectionTimeoutMillis
});


export const db = drizzle(pool);

export { pool };