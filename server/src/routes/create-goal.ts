import type { users } from '@db/schema'
import { createGoal } from '@functions/create-goal'
import type { InferSelectModel } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
      onRequest: request => request.jwtVerify(),
    },
    async (request, reply) => {
      const { title, desiredWeeklyFrequency } = request.body
      const { id } = request.user as InferSelectModel<typeof users>

      await createGoal({
        user: id,
        title,
        desiredWeeklyFrequency,
      }).then(result => {
        reply.status(201).send(result)
      })
    }
  )
}

export default createGoalRoute
