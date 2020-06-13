import moment from 'moment'
import express, { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

import { createInvoice } from './controller'
import { DATE_FORMAT } from '../../../../constants'
import { ownCompany } from '../../../../middlewares/ownCompany'
import { currentUser } from '../../../../middlewares/currentUser'
import { requireAuth } from '../../../../middlewares/requireAuth'
import { RequestValidationError } from '../../../../errors/RequestValidationError'

const router = express.Router()

router.post(
  '/invoices',
  currentUser,
  requireAuth,
  ownCompany,
  [
    check('clientId').exists().withMessage('Client ID is required').bail().isUUID().withMessage('Client ID should be in the correct format'),
    check('issueDate').exists().withMessage('Date of issue is required').bail().custom((value) => moment(value, DATE_FORMAT).isValid()).withMessage('Date of issue is not in the correct format'),
    check('dueDate').exists().withMessage('Due date is required').bail().custom((value) => moment(value, DATE_FORMAT).isValid()).withMessage('Due date is not in the correct format')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    return await createInvoice(req, res)
  }
)

export { router as invoicesRouterV1 }
