import type { users } from '@db/schema'
import { getWeekPendingGoals } from '@functions/get-week-pending-goals'
import type { InferSelectModel } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/goals',
    {
      schema: {
        querystring: z.object({
          archived: z
            .enum(['true', 'false'])
            .transform(value => value === 'true')
            .optional(),
        }),
      },
      onRequest: request => request.jwtVerify(),
    },
    request => {
      const { archived } = request.query
      const { id } = request.user as InferSelectModel<typeof users>

      return getWeekPendingGoals({ user: id, archived })
    }
  )
}

export default getWeekPendingGoalsRoute
