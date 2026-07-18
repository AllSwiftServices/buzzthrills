import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  console.error('[DB] Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const pool = new Pool({ connectionString: rawUrl, connectionTimeoutMillis: 10_000 });
const db = drizzle(pool);

async function runMigrations() {
  console.log('[DB] Running migrations…');
  await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });
  console.log('[DB] Migrations complete.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('[DB] Migration failed:', err.message);
  process.exit(1);
});
