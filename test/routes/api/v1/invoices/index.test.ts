import request from 'supertest'
import { createConnection, Connection, Repository } from 'typeorm'

import { app } from '../../../../../src/app'
import { TestUtils } from '../../../../TestUtils'
import { Invoice } from '../../../../../src/entities/Invoice'
import { InvoiceItem } from '../../../../../src/entities/InvoiceItem'

describe('invoices routes', () => {
  const myCompany1 = '2fca32b6-a177-4bcd-9855-8df929718ac8'
  const myCompany2 = 'c319ba51-adf1-4c34-bdc3-ba73ac92d541'

  let connection: Connection
  let testUtils: TestUtils
  let invoiceRepository: Repository<Invoice>
  let invoiceItemRepository: Repository<InvoiceItem>

  beforeAll(async () => {
    connection = await createConnection(process.env.NODE_ENV!)
    testUtils = new TestUtils(connection)
    invoiceRepository = connection.getRepository(Invoice)
    invoiceItemRepository = connection.getRepository(InvoiceItem)
  })

  beforeEach(async () => {
    await testUtils.clearDb()
  })

  afterAll(async () => {
    await testUtils.closeConnection()
  })

  it('should have a route handler listening to /api/v1/invoices for post requests', async () => {
    const response = await request(app).post(`/api/v1/invoices`).send({})

    expect(response.status).not.toEqual(404)
  })

  it('can not access the route to create an invoice if the user is not signed in', async () => {
    await request(app).post(`/api/v1/invoices`).send({}).expect(401)
  })

  it('can not access the route to create an invoice if the user does not own this company', async () => {
    const someoneElsesCompany = '90711ec0-abf2-4f37-a9ea-d007c048e64b'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: someoneElsesCompany
      })
      .expect(401)
  })

  it('should return an error if clientId in the request body is not a correct UUID when creating an invoice', async () => {
    const issueDate = '09/12/2011'
    const dueDate = '16/12/2011'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        issueDate,
        dueDate
      })
      .expect(400)
  })

  it('should return an error if issueDate is not provided in the request body when creating an invoice', async () => {
    const dueDate = '09/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        clientId,
        dueDate
      })
      .expect(400)
  })

  it('should return an error if issueDate is not in DD/MM/YYYY format when creating an invoice', async () => {
    const issueDate = 'sdfsdfs'
    const dueDate = '09/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    const response = await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        clientId,
        dueDate,
        issueDate
      })
      .expect(400)

    expect(response.body).toEqual({
      errors: [
        {
          message: 'Date of issue is not in the correct format',
          field: 'issueDate'
        }
      ]
    })
  })

  it('should return an error if dueDate is not provided in the request body when creating an invoice', async () => {
    const issueDate = '09/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        clientId,
        issueDate
      })
      .expect(400)
  })

  it('should return an error if dueDate is not in DD/MM/YYYY format when creating an invoice', async () => {
    const issueDate = '09/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    const dueDate = 'sdfsdfsdf'
    const response = await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        clientId,
        issueDate,
        dueDate
      })
      .expect(400)

    expect(response.body).toEqual({
      errors: [
        {
          message: 'Due date is not in the correct format',
          field: 'dueDate'
        }
      ]
    })
  })

  it('should create an invoice and persist the data in the database when the user signs in and owns the company and provided correct date of issue, due date and clientId', async () => {
    const issueDate = '09/12/2019'
    const dueDate = '16/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        clientId,
        issueDate,
        dueDate
      })
      .expect(201)

    const invoice = await invoiceRepository.findOne({
      companyId: myCompany1,
      clientId
    })
    expect(invoice!.companyId).toBe(myCompany1)
    expect(invoice!.clientId).toBe(clientId)
    expect(invoice!.id).not.toBe(null)
  })

  it('should be able to create invoice items when an invoice is created', async () => {
    const issueDate = '09/12/2019'
    const dueDate = '16/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    const taxId = 'edd4f62c-a94f-4526-afcf-b109ddd5b558'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${testUtils.signInWithCompanies([myCompany1, myCompany2])}`])
      .send({
        companyId: myCompany1,
        clientId,
        issueDate,
        dueDate,
        invoiceItems: [
          {
            name: 'Invoice Item 1',
            description: 'Invoice item 1 description',
            quantity: 1,
            rate: 3000,
            taxId
          },
          {
            name: 'Invoice Item 2',
            description: 'Invoice item 2 description',
            quantity: 2,
            rate: 1000,
            taxId
          }
        ]
      })
      .expect(201)

    const invoice = await invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.invoiceItems', 'invoiceItem')
      .where('invoice.companyId = :companyId', { companyId: myCompany1 })
      .getOne()
    expect(invoice!.invoiceItems).toHaveLength(2)
  })
})
