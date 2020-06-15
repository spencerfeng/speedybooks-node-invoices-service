import { getConnection } from 'typeorm'

import { Invoice } from '../entities/Invoice'

export const isInvoiceNoAlreadyTakenByCompany = async (invoiceNo: string, companyId: string) => {
  const invoiceRepository = getConnection(process.env.NODE_ENV).getRepository(Invoice)
  return await invoiceRepository.findOne({ invoiceNo, companyId })
}