import type { users } from '@db/schema'
import { completeGoal } from '@functions/complete-goal'
import type { InferSelectModel } from 'drizzle-orm'
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
      onRequest: request => request.jwtVerify(),
    },
    request => {
      const { id } = request.params
      const { id: user } = request.user as InferSelectModel<typeof users>

      return completeGoal({ user, id })
    }
  )
}

export default completeGoalRoute
