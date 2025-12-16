import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LeadStatus } from '../common/enums/lead-status.enum';
import { PropriedadeRural } from './propriedade-rural.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NOVO,
  })
  status: LeadStatus;

  @Column({ type: 'text', nullable: true })
  comentarios: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  municipio: string;

  @OneToMany(() => PropriedadeRural, (propriedade) => propriedade.lead, {
    cascade: true,
  })
  properties: PropriedadeRural[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
