import db from '@db'
import { goals } from '@db/schema'
import { eq } from 'drizzle-orm'

type ArchiveGoalRequest = {
  id: string
  archive: boolean
}

export async function archiveGoal(request: ArchiveGoalRequest) {
  const { id, archive } = request

  return await db
    .update(goals)
    .set({ archived: archive })
    .where(eq(goals.id, id))
    .returning()
    .then(result => ({
      goal: result[0],
    }))
}
