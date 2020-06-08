import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'

import { Invoice } from './Invoice'

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  quantity!: number

  @Column()
  rate!: number

  @Column()
  taxId!: string

  @ManyToOne((type) => Invoice, (invoice) => invoice.invoiceItems)
  invoice!: Invoice

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string
}
