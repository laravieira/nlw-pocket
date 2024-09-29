import type { users } from '@db/schema'
import { getWeekSummary } from '@functions/get-week-summary'
import type { InferSelectModel } from 'drizzle-orm'
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
      onRequest: request => request.jwtVerify(),
    },
    request => {
      const { week, year } = request.query
      const { id } = request.user as InferSelectModel<typeof users>

      return getWeekSummary({ user: id, week, year })
    }
  )
}

export default getWeekSummaryRoute
