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
})
