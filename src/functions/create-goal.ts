import db from '../db'
import { goals } from '../db/schema'

type CreateGoalRequest = {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoal(request: CreateGoalRequest) {
  const { title, desiredWeeklyFrequency } = request

  return await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()
    .then(result => ({
      goal: result[0],
    }))
}
