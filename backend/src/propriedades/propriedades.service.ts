import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { PropriedadeRural } from '../entities/propriedade-rural.entity';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';

@Injectable()
export class PropriedadesService {
  constructor(
    @InjectRepository(PropriedadeRural)
    private readonly propriedadeRepository: Repository<PropriedadeRural>,
  ) {}

  async create(
    createPropriedadeDto: CreatePropriedadeDto,
  ): Promise<PropriedadeRural> {
    const propriedade = this.propriedadeRepository.create(createPropriedadeDto);
    return this.propriedadeRepository.save(propriedade);
  }

  async findAll(filters?: {
    leadId?: string;
    cultura?: string;
    areaMinima?: number;
  }): Promise<PropriedadeRural[]> {
    const where: any = {};

    if (filters?.leadId) {
      where.leadId = filters.leadId;
    }

    if (filters?.cultura) {
      where.cultura = filters.cultura;
    }

    if (filters?.areaMinima) {
      where.areaHectares = MoreThan(filters.areaMinima);
    }

    return this.propriedadeRepository.find({
      where,
      relations: ['lead'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PropriedadeRural> {
    const propriedade = await this.propriedadeRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!propriedade) {
      throw new NotFoundException(
        `Propriedade com ID ${id} não encontrada`,
      );
    }

    return propriedade;
  }

  async update(
    id: string,
    updatePropriedadeDto: UpdatePropriedadeDto,
  ): Promise<PropriedadeRural> {
    const propriedade = await this.findOne(id);
    Object.assign(propriedade, updatePropriedadeDto);
    return this.propriedadeRepository.save(propriedade);
  }

  async remove(id: string): Promise<void> {
    const propriedade = await this.findOne(id);
    await this.propriedadeRepository.remove(propriedade);
  }
}

