import express from 'express'
import { config } from 'dotenv'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import { invoicesRouterV1 } from './routes/api/v1/invoices'

config()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1', invoicesRouterV1)

export { app }
