import express from 'express'

import { invoicesRouterV1 } from './routes/api/v1/invoices'

const app = express()

app.use('/api/v1', invoicesRouterV1)

export { app }
