import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

import { InvoiceItem } from './InvoiceItem'

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  clientId!: string

  @Column()
  issueDate!: string

  @Column()
  dueDate!: string

  @Column()
  companyId!: string

  @OneToMany((type) => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoiceItems!: InvoiceItem[]

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string
}
