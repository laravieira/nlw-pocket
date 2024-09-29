import db from '@db'
import { goals } from '@db/schema'

type CreateGoalRequest = {
  user: string
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoal(request: CreateGoalRequest) {
  const { user, title, desiredWeeklyFrequency } = request

  return await db
    .insert(goals)
    .values({
      userId: user,
      title,
      desiredWeeklyFrequency,
    })
    .returning()
    .then(result => ({
      goal: result[0],
    }))
}
