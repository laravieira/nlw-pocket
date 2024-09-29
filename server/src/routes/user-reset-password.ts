import { userResetPassword } from '@functions/user-reset-password'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const userResetPasswordRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users/reset-password',
    {
      schema: {
        querystring: z.object({
          token: z.string().min(6).max(6),
        }),
        body: z.object({
          password: z.string().min(8),
        }),
      },
    },
    request => {
      const { token } = request.query
      const { password } = request.body

      return userResetPassword({ token, password })
    }
  )
}

export default userResetPasswordRoute
