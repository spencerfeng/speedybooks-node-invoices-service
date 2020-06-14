import { getConnection } from 'typeorm'

import { Invoice } from '../../../../entities/Invoice'

export const findInvoiceByInvoiceNo = (invoiceNo: string) => {
  const invoiceRepository = getConnection(process.env.NODE_ENV).getRepository(Invoice)
  return invoiceRepository.findOne({ invoiceNo })
}