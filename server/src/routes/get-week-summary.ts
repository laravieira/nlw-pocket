import { getWeekSummary } from '@functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      schema: {
        querystring: z.object({
          week: z.coerce.number().int().min(1).max(52).optional(),
          year: z.coerce.number().int().optional(),
        }),
      },
    },
    response => getWeekSummary(response.query)
  )
}

export default getWeekSummaryRoute
