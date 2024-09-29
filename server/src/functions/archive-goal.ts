import db from '@db'
import { goals } from '@db/schema'
import { and, eq } from 'drizzle-orm'

type ArchiveGoalRequest = {
  user: string
  id: string
  archive: boolean
}

export async function archiveGoal(request: ArchiveGoalRequest) {
  const { user, id, archive } = request

  return await db
    .update(goals)
    .set({ archived: archive })
    .where(and(eq(goals.userId, user), eq(goals.id, id)))
    .returning()
    .then(result => ({
      goal: result[0],
    }))
}
