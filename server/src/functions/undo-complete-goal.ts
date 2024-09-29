import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import { and, eq } from 'drizzle-orm'

type UndoCompleteGoal = {
  user: string
  id: string
}

export async function undoCompleteGoal(request: UndoCompleteGoal) {
  const { user, id } = request

  const goalCompletion = db
    .$with('goal_completion')
    .as(
      db
        .select({ goal: goalCompletions.goalId })
        .from(goalCompletions)
        .where(eq(goalCompletions.id, id))
    )

  const goal = await db
    .with(goalCompletion)
    .select({ id: goals.id })
    .from(goals)
    .leftJoin(goalCompletion, eq(goals.id, goalCompletion.goal))
    .where(and(eq(goals.id, goalCompletion.goal), eq(goals.userId, user)))
    .then(result => result[0])

  if (!goal) {
    throw new Error('Goal not found')
  }

  return await db
    .delete(goalCompletions)
    .where(eq(goalCompletions.id, id))
    .returning()
    .then(result => ({
      goal: result[0],
    }))
}
