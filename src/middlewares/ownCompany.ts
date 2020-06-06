import { Request, Response, NextFunction } from 'express'

export const ownCompany = (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.body.companyId || req.query.companyId || ''

  // if the user does not own the company, we do not proceed
  if (!req.currentUser!.companies.includes(companyId)) {
    return res.status(401).send()
  }

  next()
}
