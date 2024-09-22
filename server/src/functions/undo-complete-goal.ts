import db from '@db'
import { goalCompletions } from '@db/schema'
import { eq } from 'drizzle-orm'

type CreateGoalRequest = {
  id: string
}

export async function undoCompleteGoal(request: CreateGoalRequest) {
  const { id } = request

  return await db
    .delete(goalCompletions)
    .where(eq(goalCompletions.id, id))
    .returning()
    .then(result => ({
      goal: result[0],
    }))
}
