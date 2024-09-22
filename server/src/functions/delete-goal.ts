import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import { eq } from 'drizzle-orm'

type DeleteGoalRequest = {
  id: string
}

export async function deleteGoal(request: DeleteGoalRequest) {
  const { id } = request

  const completions = await db
    .delete(goalCompletions)
    .where(eq(goalCompletions.goalId, id))
    .returning()

  return await db
    .delete(goals)
    .where(eq(goals.id, id))
    .returning()
    .then(result => ({
      goal: result[0],
      completions,
    }))
}
