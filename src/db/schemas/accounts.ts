import { InferModel } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['admin', 'staff', 'user'])

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 256 }).notNull(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  role: roleEnum('role').notNull()
})

export type Account = InferModel<typeof accounts, 'select'>
export type NewAccount = InferModel<typeof accounts, 'insert'>
