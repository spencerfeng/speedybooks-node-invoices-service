import jwt from 'jsonwebtoken'
import request from 'supertest'
import { createConnection, Connection, getConnection, getRepository, Repository } from 'typeorm'

import { app } from '../../../../../src/app'
import { Invoice } from '../../../../../src/entities/Invoice'

describe('invoices routes', () => {
  let connection: Connection
  let invoiceRepository: Repository<Invoice>

  beforeAll(async () => {
    connection = await createConnection(process.env.NODE_ENV!)
    invoiceRepository = connection.getRepository(Invoice)
  })

  afterAll(async () => {
    connection.close()
  })

  it('should have a route handler listening to /api/v1/invoices for post requests', async () => {
    const response = await request(app).post(`/api/v1/invoices`).send({})

    expect(response.status).not.toEqual(404)
  })

  it('can not access the route to create an invoice if the user is not signed in', async () => {
    await request(app).post(`/api/v1/invoices`).send({}).expect(401)
  })

  it('can not access the route to create an invoice if the user does not own this company', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const companyId = '047e9001-0001-5d14-4124-b165ce840ad2'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({
        companyId
      })
      .expect(401)
  })

  it('should return an error if clientId in the request body is not a correct UUID when creating an invoice', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const issueDate = '09/12/2011'
    const dueDate = '16/12/2011'
    const companyId = '057e9002-0001-5d15-6136-c266ce580ad1'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({
        companyId,
        issueDate,
        dueDate
      })
      .expect(400)
  })

  it('should return an error if issueDate is not provided in the request body when creating an invoice', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const dueDate = '09/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    const companyId = '057e9002-0001-5d15-6136-c266ce580ad1'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({
        companyId,
        clientId,
        dueDate
      })
      .expect(400)
  })

  it('should return an error if dueDate is not provided in the request body when creating an invoice', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const issueDate = '09/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    const companyId = '057e9002-0001-5d15-6136-c266ce580ad1'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({
        companyId,
        clientId,
        issueDate
      })
      .expect(400)
  })

  it('should create an invoice and persist the data in the database when the user signs in and owns the company and provided correct date of issue, due date and clientId', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const issueDate = '09/12/2019'
    const dueDate = '16/12/2019'
    const clientId = '8920d75f-3940-46e2-8e7c-b5273d6bc911'
    const companyId = '057e9002-0001-5d15-6136-c266ce580ad1'
    await request(app)
      .post(`/api/v1/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({
        companyId,
        clientId,
        issueDate,
        dueDate
      })
      .expect(201)

    const invoiceRepository = getConnection(process.env.NODE_ENV).getRepository(Invoice)
    const invoice = await invoiceRepository.findOne({
      companyId,
      clientId
    })
    expect(invoice!.companyId).toBe(companyId)
    expect(invoice!.clientId).toBe(clientId)
    expect(invoice!.id).not.toBe(null)
  })
})
