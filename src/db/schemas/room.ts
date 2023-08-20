import { InferModel, relations } from 'drizzle-orm'
import { pgTable, pgEnum, varchar, uuid, timestamp, doublePrecision } from 'drizzle-orm/pg-core'

import { roomTypes } from './roomType'

export const roomStatusEnum = pgEnum('roomStatusEnum', ['available', 'unavailable', 'cleaning', 'maintenance', 'other'])

export const rooms = pgTable('room', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomTypeId: uuid('room_type_id').notNull().references(() => roomTypes.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  roomNumber: varchar('roomNumber', { length: 16 }).notNull(),
  price: doublePrecision('price'),
  status: roomStatusEnum('status').notNull().default('available'),
  statusAdditionalReason: varchar('status_additional_reason', { length: 256 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const roomsRelations = relations(rooms, ({ one }) => ({
  roomType: one(roomTypes, {
    fields: [rooms.roomTypeId],
    references: [roomTypes.id]
  })
}))

export type Room = InferModel<typeof rooms, 'select'>
export type NewRoom = InferModel<typeof rooms, 'insert'>
