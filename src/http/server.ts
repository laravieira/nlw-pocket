import * as fs from 'node:fs'
import * as path from 'node:path'
import { env } from '@/env'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Load all routes from the routes folder
const files = fs.readdirSync(path.join(__dirname, '../routes'))
for (const file of files) {
  const filePath = path.join(__dirname, '../routes', file)
  if (fs.statSync(filePath).isFile() && file.endsWith('.ts')) {
    const route = require(filePath)
    if (typeof route.default === 'function') app.register(route)
  }
}

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log(`Server is running on port ${3000}`))
