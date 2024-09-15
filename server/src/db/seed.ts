import dayjs from 'dayjs'
import db, { client } from './index'
import { goalCompletions, goals } from './schema'

async function seed() {
  // Delete all goals and goal completions
  await db.delete(goalCompletions)
  await db.delete(goals)

  // Insert goals
  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Write a blog post',
        desiredWeeklyFrequency: 1,
      },
      {
        title: 'Read a book',
        desiredWeeklyFrequency: 3,
      },
      {
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
