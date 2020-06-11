import { getConnection } from 'typeorm'
import express, { Request, Response } from 'express'
import { checkSchema, validationResult } from 'express-validator'

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
    },
    dueDate: {
      in: ['body'],
      exists: {
        errorMessage: 'Due date is required'
      }
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

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
  }
)

export { router as invoicesRouterV1 }
