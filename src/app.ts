import express from 'express'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'

import { invoicesRouterV1 } from './routes/api/v1/invoices'

config()
const app = express()

app.use(cookieParser())

app.use('/api/v1', invoicesRouterV1)

export { app }
