import { InferModel, relations } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { profiles } from './profile'

export const roleEnum = pgEnum('role', ['admin', 'staff', 'user'])

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 256 }).notNull().unique(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  role: roleEnum('role').notNull()
})

export const accountsRelations = relations(accounts, ({ one }) => ({
  profile: one(profiles, {
    fields: [accounts.id],
    references: [profiles.account_id]
  })
}))

export type Account = InferModel<typeof accounts, 'select'>
export type NewAccount = InferModel<typeof accounts, 'insert'>
