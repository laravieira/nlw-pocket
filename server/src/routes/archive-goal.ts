import type { users } from '@db/schema'
import { archiveGoal } from '@functions/archive-goal'
import type { InferSelectModel } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const archiveGoalRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/goals/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          archive: z.boolean(),
        }),
      },
      onRequest: request => request.jwtVerify(),
    },
    request => {
      const { id } = request.params
      const { archive } = request.body
      const { id: user } = request.user as InferSelectModel<typeof users>

      return archiveGoal({ user, id, archive })
    }
  )
}

export default archiveGoalRoute
