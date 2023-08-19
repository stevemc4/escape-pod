import { InferModel } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'

import { accounts } from './accounts'

export const roleEnum = pgEnum('role', ['admin', 'staff', 'user'])

export const profiles = pgTable('profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  account_id: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  name: varchar('username', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export type Profile = InferModel<typeof profiles, 'select'>
export type NewProfile = InferModel<typeof profiles, 'insert'>
