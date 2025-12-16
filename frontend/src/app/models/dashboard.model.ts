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

