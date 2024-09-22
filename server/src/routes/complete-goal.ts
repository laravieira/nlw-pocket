import { completeGoal } from '@functions/complete-goal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const completeGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    request => completeGoal(request.params)
  )
}

export default completeGoalRoute
