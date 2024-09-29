import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

type CompleteGoalProps = {
  user: string
  id: string
}

export async function completeGoal(props: CompleteGoalProps) {
  const { user, id } = props
  const today = dayjs()

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.completedAt, today.startOf('week').toDate()),
          lte(goalCompletions.completedAt, today.endOf('week').toDate()),
          eq(goalCompletions.goalId, id)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(and(eq(goals.userId, user), eq(goals.id, id)))
    .limit(1)

  const [{ desiredWeeklyFrequency, completionCount }] = result
  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week.')
  }

  return db
    .insert(goalCompletions)
    .values({ goalId: id })
    .returning()
    .then(result => ({
      goalCompletion: result[0],
    }))
}
