import jwt from 'jsonwebtoken'
import { Connection, EntityMetadata } from 'typeorm'

export class TestUtils {
  constructor(private connection: Connection) {}

  clearDb = async () => {
    const entityMetadatas: EntityMetadata[] = this.connection.entityMetadatas
    for (const entityMetadata of entityMetadatas) {
      const repository = await this.connection.getRepository(entityMetadata.name)
      await repository.query(`DELETE FROM ${entityMetadata.tableName}`)
    }
  }

  closeConnection = async () => {
    if (this.connection) await this.connection.close()
  }

  signInWithCompanies = (companies: string[]): string => {
    const userId = 'eb7b2d22-a933-4563-8b20-d5a732209e5a'

    const payload = {
      id: userId,
      email: 'test@email.com',
      companies: companies.join(',')
    }

    return jwt.sign(payload, process.env.JWT_KEY!)
  }
}
