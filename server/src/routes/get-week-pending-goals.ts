import { getWeekPendingGoals } from '@functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/goals', getWeekPendingGoals)
}

export default getWeekPendingGoalsRoute
