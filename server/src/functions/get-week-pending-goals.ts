import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

export async function getWeekPendingGoals() {
  const today = dayjs()

  const goalsCreatedUpToThisWeek = db.$with('goals_created_up_to_this_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, today.endOf('week').toDate()))
  )

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
          lte(goalCompletions.completedAt, today.endOf('week').toDate())
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  return db
    .with(goalsCreatedUpToThisWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToThisWeek.id,
      title: goalsCreatedUpToThisWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToThisWeek.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedUpToThisWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToThisWeek.id)
    )
}
