import moment from 'moment'
import { getConnection } from 'typeorm'
import express, { Request, Response } from 'express'
import { validationResult, check } from 'express-validator'

import { DATE_FORMAT } from '../../../../constants'
import { Invoice } from '../../../../entities/Invoice'
import { InvoiceItem } from '../../../../entities/InvoiceItem'
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

    try {
      const invoiceRepository = getConnection(process.env.NODE_ENV).getRepository(Invoice)
      const invoice = new Invoice()
      invoice.clientId = req.body.clientId
      invoice.issueDate = req.body.issueDate
      invoice.dueDate = req.body.dueDate
      invoice.companyId = req.body.companyId

      await invoiceRepository.save(invoice)

      const invoiceItemsFromReq = req.body.invoiceItems
      if (Array.isArray(invoiceItemsFromReq)) {
        const invoiceItemRepository = getConnection(process.env.NODE_ENV).getRepository(InvoiceItem)

        for (const item of invoiceItemsFromReq) {
          const newInvoiceItem = new InvoiceItem()
          newInvoiceItem.name = item.name || ''
          newInvoiceItem.description = item.description || ''
          newInvoiceItem.quantity = item.quantity || 0
          newInvoiceItem.rate = item.rate || 0
          if (item.taxId) {
            newInvoiceItem.taxId = item.taxId
          }
          newInvoiceItem.invoice = invoice
          await invoiceItemRepository.save(newInvoiceItem)
        }
      }

      res.status(201).send()
    } catch (err) {
      throw new Error(err.message)
    }
  }
)

export { router as invoicesRouterV1 }
