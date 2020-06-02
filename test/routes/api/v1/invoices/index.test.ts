import jwt from 'jsonwebtoken'
import request from 'supertest'

import { app } from '../../../../../src/app'

describe('invoices routes', () => {
  it('should have a route handler listening to /api/v1/companies/:company/invoices for post requests', async () => {
    const companyUuid = '047e9001-0001-5d14-4124-b165ce840ad2'
    const response = await request(app).post(`/api/v1/companies/${companyUuid}/invoices`).send({})

    expect(response.status).not.toEqual(404)
  })

  it('can not access the route to create an invoice if the user is not signed in', async () => {
    const companyUuid = '047e9001-0001-5d14-4124-b165ce840ad2'
    await request(app).post(`/api/v1/companies/${companyUuid}/invoices`).send({}).expect(401)
  })

  it('can not access the route to create an invoice if the user does not own this company', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const companyUuid = '047e9001-0001-5d14-4124-b165ce840ad2'
    await request(app)
      .post(`/api/v1/companies/${companyUuid}/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({})
      .expect(401)
  })

  it('can access the route to create an invoice if the user is signed in and the user owns the company', async () => {
    const payload = {
      id: '089f9u01-u091-ud17-6176-c2f6t784067y',
      email: 'test@email.com',
      companies: '057e9002-0001-5d15-6136-c266ce580ad1, 097e7112-8881-5d15-6136-r586ty580bg3'
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!)

    const companyUuid = '057e9002-0001-5d15-6136-c266ce580ad1'
    await request(app)
      .post(`/api/v1/companies/${companyUuid}/invoices`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .send({})
      .expect(201)
  })
})
