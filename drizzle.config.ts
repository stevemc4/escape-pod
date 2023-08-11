import { config } from 'dotenv'
import type { Config } from 'drizzle-kit'

config()

export default {
  schema: './src/db/schemas/*',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.PG_CONNECTION_STRING as string
  }
} satisfies Config
