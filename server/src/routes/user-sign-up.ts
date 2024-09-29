import { userSignUp } from '@functions/user-sign-up'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const userSignUpRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    request => userSignUp(request.body)
  )
}

export default userSignUpRoute
