import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string
}
