import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  logoUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  categoryId!: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;
} 