import { InferModel, relations } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'

import { accounts } from './accounts'
import { rooms } from './room'
import { guests } from './guests'

export const statusEnum = pgEnum('reservation_status', ['reserved', 'checked_in', 'checked_out', 'cancelled'])

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  reserverAccountId: uuid('reserver_account_id').notNull().references(() => accounts.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  reserverName: varchar('reserver_name', { length: 256 }).notNull(),
  reserverId: varchar('reserver_id', { length: 64 }),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  status: statusEnum('status').notNull().default('reserved'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
  checkedOutAt: timestamp('checked_out_at', { withTimezone: true })
})

export const reservationsRelations = relations(reservations, ({ one, many }) => ({
  reserverAccount: one(accounts, {
    fields: [reservations.reserverAccountId],
    references: [accounts.id]
  }),
  guests: many(guests)
}))

export type Reservation = InferModel<typeof reservations, 'select'>
export type NewReservation = InferModel<typeof reservations, 'insert'>
