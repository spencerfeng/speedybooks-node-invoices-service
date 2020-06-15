import moment from 'moment'
import express, { Request, Response } from 'express'
import { check, validationResult, body } from 'express-validator'

import { createInvoice } from './controller'
import { findInvoiceByInvoiceNo } from './service'
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
    body('invoiceNo').exists().withMessage('Invoice No is required').bail().not().isEmpty().withMessage('Invoice No is required').custom(async (value) => {
      const invoice = await findInvoiceByInvoiceNo(value)
      if (invoice) {
        throw new Error('This invoice No already exsits')
      }
    }),
    body('clientId').exists().withMessage('Client ID is required').bail().isUUID().withMessage('Client ID should be in the correct format'),
    body('issueDate').exists().withMessage('Date of issue is required').bail().custom((value) => moment(value, DATE_FORMAT).isValid()).withMessage('Date of issue is not in the correct format'),
    body('dueDate').exists().withMessage('Due date is required').bail().custom((value) => moment(value, DATE_FORMAT).isValid()).withMessage('Due date is not in the correct format')
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
