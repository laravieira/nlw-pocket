import { getWeekPendingGoals } from '@functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.get('/goals', getWeekPendingGoals)
}

export default createGoalRoute
