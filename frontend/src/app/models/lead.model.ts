export enum LeadStatus {
  NOVO = 'novo',
  CONTATO_INICIAL = 'contato_inicial',
  EM_NEGOCIACAO = 'em_negociacao',
  CONVERTIDO = 'convertido',
  PERDIDO = 'perdido',
}

export interface Lead {
  id?: string;
  nome: string;
  cpf: string;
  status: LeadStatus;
  comentarios?: string;
  municipio?: string;
  properties?: Property[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Property {
  id?: string;
  leadId: string;
  culture: string;
  areaHectares: number;
  lead?: Lead;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PropertyType = Property;

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

