import { InferModel, relations } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp, text, integer, doublePrecision } from 'drizzle-orm/pg-core'

import { rooms } from './room'

export const roomTypes = pgTable('room_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 72 }).notNull(),
  shortDescription: varchar('short_desc', { length: 256 }).notNull().default(''),
  description: text('description').notNull().default(''),
  maxOccupant: integer('max_occupant').notNull().default(1),
  basePrice: doublePrecision('base_price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const roomTypesRelations = relations(roomTypes, ({ many }) => ({
  rooms: many(rooms)
}))

export type RoomType = InferModel<typeof roomTypes, 'select'>
export type NewRoomType = InferModel<typeof roomTypes, 'insert'>
