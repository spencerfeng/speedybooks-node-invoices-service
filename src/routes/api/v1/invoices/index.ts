import express, { Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'

import { currentUser } from '../../../../middlewares/currentUser'
import { requireAuth } from '../../../../middlewares/requireAuth'
import { ownCompany } from '../../../../middlewares/ownCompany'

const router = express.Router()

router.post(
  '/invoices',
  currentUser,
  requireAuth,
  ownCompany,
  checkSchema({
    clientId: {
      in: ['body'],
      isUUID: {
        errorMessage: 'Client ID should be in the correct format'
      }
    },
    issueDate: {
      in: ['body'],
      exists: {
        errorMessage: 'Date of issue is required'
      }
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send()
    }

    res.status(201).send()
  }
)

export { router as invoicesRouterV1 }
