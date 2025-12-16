import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '../common/enums/lead-status.enum';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Remove formatação do CPF
    const cpfLimpo = createLeadDto.cpf.replace(/\D/g, '');

    // Verifica se CPF já existe
    const existingLead = await this.leadRepository.findOne({
      where: { cpf: cpfLimpo },
    });

    if (existingLead) {
      throw new ConflictException('CPF já cadastrado');
    }

    const lead = this.leadRepository.create({
      ...createLeadDto,
      cpf: cpfLimpo,
    });

    return this.leadRepository.save(lead);
  }

  async findAll(filters?: {
    nome?: string;
    status?: LeadStatus;
    municipio?: string;
  }): Promise<Lead[]> {
    const where: any = {};

    if (filters?.nome) {
      where.nome = Like(`%${filters.nome}%`);
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.municipio) {
      where.municipio = Like(`%${filters.municipio}%`);
    }

    return this.leadRepository.find({
      where,
      relations: ['properties'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['properties'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    if (updateLeadDto.cpf) {
      const cpfLimpo = updateLeadDto.cpf.replace(/\D/g, '');
      
      // Verifica se o novo CPF já existe em outro lead
      const existingLead = await this.leadRepository.findOne({
        where: { cpf: cpfLimpo },
      });

      if (existingLead && existingLead.id !== id) {
        throw new ConflictException('CPF já cadastrado em outro lead');
      }

      updateLeadDto.cpf = cpfLimpo;
    }

    Object.assign(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadRepository.remove(lead);
  }
}

