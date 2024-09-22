import { archiveGoal } from '@functions/archive-goal'
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
    },
    request =>
      archiveGoal({
        ...request.params,
        ...request.body,
      })
  )
}

export default archiveGoalRoute
