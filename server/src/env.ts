import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string({ message: 'NODE_ENV is required' }),
  PORT: z.coerce.number({ message: 'PORT is required' }),
  CORS_ORIGIN: z.string({ message: 'CORS_ORIGIN is required' }),

  DB_HOST: z.string({ message: 'DB_HOST is required' }),
  DB_PORT: z.coerce.number({ message: 'DB_PORT is required' }),
  DB_USER: z.string({ message: 'DB_USER is required' }),
  DB_PASS: z.string({ message: 'DB_PASS is required' }),
  DB_NAME: z.string({ message: 'DB_NAME is required' }),

  SMTP_HOST: z.string({ message: 'SMTP_HOST is required' }),
  SMTP_PORT: z.coerce.number({ message: 'SMTP_PORT is required' }),
  SMTP_USER: z.string({ message: 'SMTP_USER is required' }),
  SMTP_PASS: z.string({ message: 'SMTP_PASS is required' }),
  SMTP_SECURE: z.enum(['true', 'false']).transform(value => value === 'true'),
  SMTP_FROM: z.string({ message: 'SMTP_FROM is required' }),

  JWT_SECRET: z.string({ message: 'JWT_SECRET is required' }),
  PASSWORD_PREFIX: z.string({ message: 'PASSWORD_PREFIX is required' }),
})

export const env = envSchema.parse(process.env)
