import { userSignIn } from '@functions/user-sign-in'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const userSignInRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users/sign-in',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const user = await userSignIn(request.body)

      return {
        token: await reply.jwtSign(user),
      }
    }
  )
}

export default userSignInRoute
