import { deleteGoal } from '@functions/delete-goal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const deleteGoalRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/goals/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    request => deleteGoal(request.params)
  )
}

export default deleteGoalRoute
