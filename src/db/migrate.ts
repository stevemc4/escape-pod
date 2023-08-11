import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from './client'

await migrate(db, { migrationsFolder: './src/db/migrations' })
console.log('Done! ^c to exit')
