import { env } from '@/env'
import db from '@db'
import { users } from '@db/schema'
import bcrypt from 'bcrypt'
import { and, eq } from 'drizzle-orm'

type UserSignInRequest = {
  email: string
  password: string
}

export async function userSignIn(request: UserSignInRequest) {
  const { email, password } = request

  const { password: hash, ...user } = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      verified: users.verified,
      password: users.password,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .then(result => result[0])

  if (!user) throw new Error('Invalid e-mail or password')
  if (!user.verified) throw new Error('E-mail is not verified')
  if (!(await bcrypt.compare(env.PASSWORD_PREFIX + password, hash)))
    throw new Error('Invalid e-mail or password')

  return user
}
