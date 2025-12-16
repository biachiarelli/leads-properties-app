import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { PropriedadeRural } from '../entities/propriedade-rural.entity';
import { LeadStatus } from '../common/enums/lead-status.enum';

export interface DashboardMetrics {
  totalLeads: number;
  leadsPorStatus: {
    status: string;
    count: number;
  }[];
  leadsPorMunicipio: {
    municipio: string;
    count: number;
  }[];
  leadsPrioritarios: {
    id: string;
    nome: string;
    totalAreaHectares: number;
    quantidadePropriedades: number;
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(PropriedadeRural)
    private readonly propriedadeRepository: Repository<PropriedadeRural>,
  ) {}

  async getMetrics(): Promise<DashboardMetrics> {
    // Total de leads
    const totalLeads = await this.leadRepository.count();

    // Leads por status
    const leadsPorStatus = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    // Leads por município
    const leadsPorMunicipio = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.municipio', 'municipio')
      .addSelect('COUNT(*)', 'count')
      .where('lead.municipio IS NOT NULL')
      .groupBy('lead.municipio')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Leads prioritários (com properties > 100 hectares)
    const leadsPrioritarios = await this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.properties', 'propriedade')
      .select('lead.id', 'id')
      .addSelect('lead.nome', 'nome')
      .addSelect('SUM(propriedade.area_hectares)', 'total_area_hectares')
      .addSelect('COUNT(propriedade.id)', 'quantidade_propriedades')
      .groupBy('lead.id')
      .addGroupBy('lead.nome')
      .having('SUM(propriedade.area_hectares) > :minArea', { minArea: 100 })
      .orderBy('total_area_hectares', 'DESC')
      .getRawMany();

    return {
      totalLeads,
      leadsPorStatus: leadsPorStatus.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      leadsPorMunicipio: leadsPorMunicipio.map((item) => ({
        municipio: item.municipio || 'Não informado',
        count: parseInt(item.count, 10),
      })),
      leadsPrioritarios: leadsPrioritarios.map((item) => ({
        id: item.id,
        nome: item.nome,
        totalAreaHectares: parseFloat(item.total_area_hectares) || 0,
        quantidadePropriedades: parseInt(item.quantidade_propriedades, 10),
      })),
    };
  }
}

