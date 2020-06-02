import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface UserPayloadInJwt {
  id: string
  email: string
  companies: string
}

interface UserPayload {
  id: string
  email: string
  companies: string[]
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.jwt) {
    return next()
  }

  try {
    const payloadFromJwt = jwt.verify(req.cookies.jwt, process.env.JWT_KEY!) as UserPayloadInJwt
    const payload: UserPayload = {
      ...payloadFromJwt,
      companies: payloadFromJwt.companies.split(',')
    }

    req.currentUser = payload
  } catch (err) {}

  next()
}
