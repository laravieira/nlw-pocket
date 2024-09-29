import db from '@db'
import { goalCompletions, goals } from '@db/schema'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

type GetWeekSummaryRequest = {
  user: string
  week?: number
  year?: number
}

export async function getWeekSummary(request: GetWeekSummaryRequest) {
  const {
    user,
    week: weekNumber = dayjs().week(),
    year = dayjs().year(),
  } = request
  const week = dayjs(year.toString(), 'YYYY').week(weekNumber)

  const goalsCreatedUpToThisWeek = db.$with('goals_created_up_to_this_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          eq(goals.userId, user),
          eq(goals.archived, false),
          lte(goals.createdAt, week.endOf('week').toDate())
        )
      )
  )

  const goalCompletedThisWeek = db.$with('goal_completed_this_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        completion: sql`(${goalCompletions.id})`.as('completion'),
        completedAt: goalCompletions.completedAt,
        completedAtDate: sql`DATE(${goalCompletions.completedAt})`.as(
          'completedAtDate'
        ),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goalCompletions.goalId, goals.id))
      .where(
        and(
          gte(goalCompletions.completedAt, week.startOf('week').toDate()),
          lte(goalCompletions.completedAt, week.endOf('week').toDate())
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
            'completion', ${goalCompletedThisWeek.completion},
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
