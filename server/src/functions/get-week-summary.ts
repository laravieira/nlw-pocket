import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import dayjs from 'dayjs'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'

export async function getWeekSummary() {
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

  const goalCompletedThisWeek = db.$with('goal_completed_this_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        completedAt: goalCompletions.completedAt,
        completedAtDate: sql`DATE(${goalCompletions.completedAt})`.as(
          'completedAtDate'
        ),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goalCompletions.goalId, goals.id))
      .where(
        and(
          gte(goalCompletions.completedAt, today.startOf('week').toDate()),
          lte(goalCompletions.completedAt, today.endOf('week').toDate())
        )
      )
      .orderBy(desc(goalCompletions.completedAt))
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalCompletedThisWeek.completedAtDate,
        completions: sql`JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalCompletedThisWeek.id},
            'title', ${goalCompletedThisWeek.title},
            'completedAt', ${goalCompletedThisWeek.completedAt}
          )
        )`.as('completions'),
      })
      .from(goalCompletedThisWeek)
      .groupBy(goalCompletedThisWeek.completedAtDate)
      .orderBy(desc(goalCompletedThisWeek.completedAtDate))
  )

  return db
    .with(
      goalsCreatedUpToThisWeek,
      goalCompletedThisWeek,
      goalsCompletedByWeekDay
    )
    .select({
      completed: sql`(SELECT COUNT(*) FROM ${goalCompletedThisWeek})`.mapWith(
        Number
      ),
      total:
        sql`(SELECT SUM(${goalsCreatedUpToThisWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToThisWeek})`.mapWith(
          Number
        ),
      goalsPerDay:
        sql`JSON_OBJECT_AGG(${goalsCompletedByWeekDay.completedAtDate}, ${goalsCompletedByWeekDay.completions})`.as(
          'goalsPerDay'
        ),
    })
    .from(goalsCompletedByWeekDay)
    .then(result => ({
      summary: result[0],
    }))
}
