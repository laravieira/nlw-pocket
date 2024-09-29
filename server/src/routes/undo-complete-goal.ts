import type { users } from '@db/schema'
import { undoCompleteGoal } from '@functions/undo-complete-goal'
import type { InferSelectModel } from 'drizzle-orm'
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
      onRequest: request => request.jwtVerify(),
    },
    request => {
      const { id } = request.params
      const { id: user } = request.user as InferSelectModel<typeof users>

      return undoCompleteGoal({ user, id })
    }
  )
}

export default undoCompleteGoalRoute
