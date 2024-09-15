import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { env } from '../env'
import { createGoal } from '../functions/create-goal'
import { getWeekPendingGoals } from '../functions/get-week-pending-goals'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async (request, reply) => {
    const { title, desiredWeeklyFrequency } = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    }).then(result => {
      reply.status(201).send(result)
    })
  }
)
app.get('/goals', getWeekPendingGoals)

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log(`Server is running on port ${3000}`))
