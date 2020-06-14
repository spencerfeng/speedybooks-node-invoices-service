import { getConnection } from 'typeorm'
import { Request, Response } from 'express'

import { Invoice } from '../../../../entities/Invoice'
import { InvoiceItem } from '../../../../entities/InvoiceItem'

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceRepository = getConnection(process.env.NODE_ENV).getRepository(Invoice)
    const invoice = new Invoice()
    invoice.invoiceNo = req.body.invoiceNo
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