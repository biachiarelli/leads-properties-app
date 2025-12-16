import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { Property } from '../entities/property.entity';
import { LeadStatus } from '../common/enums/lead-status.enum';

export interface DashboardMetrics {
  totalLeads: number;
  leadsByStatus: {
    status: string;
    count: number;
  }[];
  leadsByMunicipio: {
    municipio: string;
    count: number;
  }[];
  priorityLeads: {
    id: string;
    nome: string;
    totalAreaHectares: number;
    qtdProperties: number;
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async getMetrics(): Promise<DashboardMetrics> {
    // Total de leads
    const totalLeads = await this.leadRepository.count();

    // Leads por status
    const leadsByStatus = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    // Leads por município
    const leadsByMunicipio = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.municipio', 'municipio')
      .addSelect('COUNT(*)', 'count')
      .where('lead.municipio IS NOT NULL')
      .groupBy('lead.municipio')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Leads prioritários (com properties > 100 hectares)
    const priorityLeads = await this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.properties', 'property')
      .select('lead.id', 'id')
      .addSelect('lead.nome', 'nome')
      .addSelect('SUM(property.area_hectares)', 'total_area_hectares')
      .addSelect('COUNT(property.id)', 'quantidade_properties')
      .groupBy('lead.id')
      .addGroupBy('lead.nome')
      .having('SUM(property.area_hectares) > :minArea', { minArea: 100 })
      .orderBy('total_area_hectares', 'DESC')
      .getRawMany();

    return {
      totalLeads,
      leadsByStatus: leadsByStatus.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      leadsByMunicipio: leadsByMunicipio.map((item) => ({
        municipio: item.municipio || 'Não informado',
        count: parseInt(item.count, 10),
      })),
      priorityLeads: priorityLeads.map((item) => ({
        id: item.id,
        nome: item.nome,
        totalAreaHectares: parseFloat(item.total_area_hectares) || 0,
        qtdProperties: parseInt(item.quantidade_properties, 10),
      })),
    };
  }
}
