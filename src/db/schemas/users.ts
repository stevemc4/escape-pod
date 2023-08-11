import { InferModel } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 256 }).notNull(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export type User = InferModel<typeof users, 'select'>
export type NewUser = InferModel<typeof users, 'insert'>
