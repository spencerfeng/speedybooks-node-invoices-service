import { createConnection } from 'typeorm'

import { app } from './app'

const start = async () => {
  await createConnection(process.env.NODE_ENV!)

  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
}

start()
