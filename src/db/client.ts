import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

config()

const sql = postgres(process.env.PG_CONNECTION_STRING ?? '', { max: 1 })
export const db = drizzle(sql)
