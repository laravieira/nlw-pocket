import { createId } from '@paralleldrive/cuid2'
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  verified: boolean('verified').notNull().default(false),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const tokens = pgTable('tokens', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull(),
  type: text('type').notNull().default('email-verification'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const goalCompletions = pgTable('goal_completions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  goalId: text('goal_id')
    .notNull()
    .references(() => goals.id),
  completedAt: timestamp('completed_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
