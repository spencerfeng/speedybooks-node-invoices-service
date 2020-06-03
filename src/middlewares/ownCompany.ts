import { Request, Response, NextFunction } from 'express'

export const ownCompany = (req: Request, res: Response, next: NextFunction) => {
  const companyUuid = req.body.company || req.query.company || ''

  // if the user does not own the company, we do not proceed
  if (!req.currentUser!.companies.includes(companyUuid)) {
    return res.status(401).send()
  }

  next()
}
