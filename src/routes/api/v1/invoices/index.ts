import express, { Request, Response } from 'express'

import { currentUser } from '../../../../middlewares/currentUser'
import { requireAuth } from '../../../../middlewares/requireAuth'

const router = express.Router()

router.post('/companies/:company/invoices', currentUser, requireAuth, async (req: Request, res: Response) => {
  res.status(201).send()
})

export { router as invoicesRouterV1 }
