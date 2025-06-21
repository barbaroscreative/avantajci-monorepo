import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Store } from './Store';
import { Bank } from './Bank';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column({ nullable: true })
  category!: string;

  @ManyToMany(() => Store, { eager: true })
  @JoinTable()
  stores!: Store[];

  @ManyToOne(() => Bank, { eager: true })
  bank!: Bank;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({ nullable: true })
  rewardAmount!: string;

  @Column({ nullable: true })
  rewardType!: string;
} 
 
 