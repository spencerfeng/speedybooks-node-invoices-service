import express, { Request, Response } from 'express'

import { currentUser } from '../../../../middlewares/currentUser'
import { requireAuth } from '../../../../middlewares/requireAuth'
import { ownCompany } from '../../../../middlewares/ownCompany'

const router = express.Router()

router.post('/invoices', currentUser, requireAuth, ownCompany, async (req: Request, res: Response) => {
  res.status(201).send()
})

export { router as invoicesRouterV1 }
