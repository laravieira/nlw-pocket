import { env } from '@/env'
import Email from '@/smtp'
import db from '@db'
import { tokens, users } from '@db/schema'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

type UserSignUpRequest = {
  name: string
  email: string
  password: string
}

export async function userSignUp(request: UserSignUpRequest) {
  const { name, email, password } = request

  const hash = await bcrypt.hash(env.PASSWORD_PREFIX + password, 10)

  const user = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email))
    .then(result => result[0])

  if (user) {
    throw new Error('E-mail already registered')
  }

  const registered = await db
    .insert(users)
    .values({
      name,
      email,
      password: hash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      verified: users.verified,
    })
    .then(result => result[0])

  const token = await db
    .insert(tokens)
    .values({
      userId: registered.id,
      token: Math.floor(1000 + Math.random() * 8999).toString(), // 4 digit random number as token
    })
    .returning({
      token: tokens.token,
    })
    .then(result => result[0].token)

  Email.sendMail({
    from: env.SMTP_FROM,
    to: email,
    subject: `Welcome to the app, ${name}!`,
    html: `
      <h1>Welcome to the app</h1>
      <h2><strong>${token}</strong></h2>
      <p>Click <a href="/verify-email?token=${token}">here</a> to verify your email</p>
    `,
  })
    .then(({ messageId }) => console.log('Email sent', messageId))
    .catch(console.error)

  return registered
}
