import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

@Entity('propriedades_rurais')
export class PropriedadeRural {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lead_id', type: 'uuid' })
  leadId: string;

  @ManyToOne(() => Lead, (lead) => lead.properties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ type: 'varchar', length: 255 })
  cultura: string;

  @Column({ name: 'area_hectares', type: 'decimal', precision: 10, scale: 2 })
  areaHectares: number;

  @Column({ type: 'jsonb', nullable: true })
  geometria: any; // GeoJSON object

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

