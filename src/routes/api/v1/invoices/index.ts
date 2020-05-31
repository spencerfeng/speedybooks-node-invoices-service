import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/:company/invoices', async (req: Request, res: Response) => {
  res.status(201).send()
})

export { router as invoicesRouterV1 }
