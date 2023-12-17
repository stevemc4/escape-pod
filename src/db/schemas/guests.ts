import { InferModel, relations } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'

import { reservations } from './reservations'

export const typeEnum = pgEnum('guest_type', ['adult', 'child'])

export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  reservationId: uuid('reservation_id').notNull().references(() => reservations.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  name: varchar('name', { length: 72 }).notNull(),
  type: typeEnum('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const guestsRelations = relations(guests, ({ one }) => ({
  reservation: one(reservations, {
    fields: [guests.reservationId],
    references: [reservations.id]
  })
}))

export type Guest = InferModel<typeof guests, 'select'>
export type NewGuest = InferModel<typeof guests, 'insert'>
