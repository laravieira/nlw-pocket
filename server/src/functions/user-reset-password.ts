import console from 'node:console'
import { env } from '@/env'
import db from '@db'
import { tokens, users } from '@db/schema'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import { and, eq, gte, lt, or } from 'drizzle-orm'

type UserResetPassword = {
  token: string
  password: string
}

export async function userResetPassword(request: UserResetPassword) {
  const { token, password } = request

  const hash = await bcrypt.hash(env.PASSWORD_PREFIX + password, 10)

  const {
    id,
    token: value,
    user,
  } = await db
    .select({
      id: tokens.id,
      token: tokens.token,
      user: tokens.userId,
    })
    .from(tokens)
    .where(
      and(
        eq(tokens.token, token),
        eq(tokens.type, 'recover-password'),
        gte(tokens.createdAt, dayjs().subtract(3, 'hours').toDate())
      )
    )
    .then(result => result[0])

  if (!id || value !== token) {
    throw new Error('Invalid token')
  }

  db.delete(tokens)
    .where(
      or(
        eq(tokens.id, id),
        lt(tokens.createdAt, dayjs().subtract(3, 'hours').toDate())
      )
    )
    .then(amount => console.log('Tokens deleted: ', amount))

  return db
    .update(users)
    .set({
      password: hash,
      verified: true,
    })
    .where(eq(users.id, user))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      verified: users.verified,
    })
    .then(result => result[0])
}
