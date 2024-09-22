import { undoCompleteGoal } from '@functions/undo-complete-goal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const undoCompleteGoalRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/completions/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    request => undoCompleteGoal(request.params)
  )
}

export default undoCompleteGoalRoute
