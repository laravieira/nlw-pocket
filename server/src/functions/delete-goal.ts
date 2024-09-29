import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import { and, eq } from 'drizzle-orm'

type DeleteGoalRequest = {
  user: string
  id: string
}

export async function deleteGoal(request: DeleteGoalRequest) {
  const { user, id } = request

  const goal = await db
    .select({ id: goals.id })
    .from(goals)
    .where(and(eq(goals.userId, user), eq(goals.id, id)))
    .then(result => result[0])

  if (!goal) {
    throw new Error('Goal not found.')
  }

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
