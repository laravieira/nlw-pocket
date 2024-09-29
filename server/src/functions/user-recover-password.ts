import * as console from 'node:console'
import { env } from '@/env'
import Email from '@/smtp'
import db from '@db'
import { tokens, users } from '@db/schema'
import { eq } from 'drizzle-orm'

type UserRecoverPassword = {
  email: string
}

export async function userRecoverPassword(request: UserRecoverPassword) {
  const { email } = request

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email))
    .then(result => result[0])

  if (!user) {
    throw new Error('Email not found')
  }

  const token = await db
    .insert(tokens)
    .values({
      userId: user.id,
      type: 'recover-password',
      token: Math.floor(100000 + Math.random() * 899999).toString(), // 6 digit random number as token
    })
    .returning({
      token: tokens.token,
    })
    .then(result => result[0].token)

  Email.sendMail({
    from: env.SMTP_FROM,
    to: user.email,
    subject: `Reset password, ${user.name}!`,
    html: `
      <h1>Reset your password</h1>
      <h2><strong>${token}</strong></h2>
      <p>Click <a href="/reset-password?token=${token}">here</a> to reset your password</p>
    `,
  })
    .then(({ messageId }) => console.log('Email sent', messageId))
    .catch(console.error)

  return true
}
