import { getWeekPendingGoals } from '@functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/goals',
    {
      schema: {
        querystring: z.object({
          archived: z.coerce.boolean().optional(),
        }),
      },
    },
    response => getWeekPendingGoals(response.query)
  )
}

export default getWeekPendingGoalsRoute
