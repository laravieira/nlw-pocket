import { userRecoverPassword } from '@functions/user-recover-password'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const userRecoverPasswordRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users/recover-password',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    request => {
      const { email } = request.body

      return userRecoverPassword({ email })
    }
  )
}

export default userRecoverPasswordRoute
