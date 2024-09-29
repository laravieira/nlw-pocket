import type { users } from '@db/schema'
import { deleteGoal } from '@functions/delete-goal'
import type { InferSelectModel } from 'drizzle-orm'
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
      onRequest: request => request.jwtVerify(),
    },
    request => {
      const { id } = request.params
      const { id: user } = request.user as InferSelectModel<typeof users>

      return deleteGoal({ user, id })
    }
  )
}

export default deleteGoalRoute
