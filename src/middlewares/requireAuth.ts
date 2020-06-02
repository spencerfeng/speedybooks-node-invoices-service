import { Request, Response, NextFunction } from 'express'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return res.status(401).send()
  }

  // if the user does not own the company, we do not proceed
  if (!req.currentUser.companies.includes(req.params.company)) {
    return res.status(401).send()
  }

  next()
}
