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
  cultura: string;
  areaHectares: number;
  geometria?: any;
  lead?: Lead;
  createdAt?: Date;
  updatedAt?: Date;
}

// Alias para compatibilidade temporária
export type PropriedadeRural = Property;

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
    quantidadeProperties: number;
  }[];
}

