import { env } from '@/env'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import db, { client } from './index'
import { goalCompletions, goals, tokens, users } from './schema'

async function seed() {
  // Delete all tables
  await db.delete(users)
  await db.delete(tokens)
  await db.delete(goalCompletions)
  await db.delete(goals)

  // Insert user
  const user = await db
    .insert(users)
    .values([
      {
        name: 'Test',
        email: 'test@email.com',
        verified: true,
        password: bcrypt.hashSync(`${env.PASSWORD_PREFIX}password`, 10),
      },
    ])
    .returning()

  // Insert goals
  const result = await db
    .insert(goals)
    .values([
      {
        userId: user[0].id,
        title: 'Write a blog post',
        desiredWeeklyFrequency: 1,
      },
      {
        userId: user[0].id,
        title: 'Read a book',
        desiredWeeklyFrequency: 3,
      },
      {
        userId: user[0].id,
        title: 'Exercise',
        desiredWeeklyFrequency: 5,
      },
    ])
    .returning()

  // Insert goal completions
  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      completedAt: dayjs().startOf('week').toDate(),
    },
    {
      goalId: result[1].id,
      completedAt: dayjs().startOf('week').add(2, 'day').toDate(),
    },
  ])
}

seed().finally(() => client.end())
