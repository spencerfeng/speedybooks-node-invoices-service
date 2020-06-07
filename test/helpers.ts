import jwt from 'jsonwebtoken'

export const myCompany1 = '2fca32b6-a177-4bcd-9855-8df929718ac8'
export const myCompany2 = 'c319ba51-adf1-4c34-bdc3-ba73ac92d541'

export const signInWithCompanies = (companies: string[]) => {
  const userId = 'eb7b2d22-a933-4563-8b20-d5a732209e5a'

  const payload = {
    id: userId,
    email: 'test@email.com',
    companies: companies.join(',')
  }

  return jwt.sign(payload, process.env.JWT_KEY!)
}
