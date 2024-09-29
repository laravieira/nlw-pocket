import { userValidateEmail } from '@functions/user-validate-email'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const userValidateEmailRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users/validate-email',
    {
      schema: {
        body: z.object({
          token: z.string().min(4).max(4),
        }),
      },
    },
    request => {
      const { token } = request.body

      return userValidateEmail({ token })
    }
  )
}

export default userValidateEmailRoute
