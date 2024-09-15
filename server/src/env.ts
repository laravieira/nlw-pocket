import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
})

export const env = envSchema.parse(process.env)
