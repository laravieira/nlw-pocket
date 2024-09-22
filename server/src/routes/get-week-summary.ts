import { getWeekSummary } from '@functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summary', getWeekSummary)
}

export default getWeekSummaryRoute
