import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardMetrics } from '../../../../core/models/lead.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TableModule, TagModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  statusChartData: any;
  municipioChartData: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.setupChartOptions();
  }

  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.setupCharts();
      },
      error: (error) => {
        console.error('Erro ao carregar métricas:', error);
      },
    });
  }

  setupChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };
  }

  setupCharts(): void {
    if (!this.metrics) return;

    // Gráfico de status
    this.statusChartData = {
      labels: this.metrics.leadsByStatus.map((item) =>
        this.formatStatus(item.status)
      ),
      datasets: [
        {
          data: this.metrics.leadsByStatus.map((item) => item.count),
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#26C6DA',
            '#EF5350',
          ],
        },
      ],
    };

    // Gráfico de municípios
    this.municipioChartData = {
      labels: this.metrics.leadsByMunicipio.map((item) => item.municipio),
      datasets: [
        {
          label: 'Leads por Município',
          data: this.metrics.leadsByMunicipio.map((item) => item.count),
          backgroundColor: '#42A5F5',
        },
      ],
    };
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      novo: 'Novo',
      contato_inicial: 'Contato Inicial',
      em_negociacao: 'Em Negociação',
      convertido: 'Convertido',
      perdido: 'Perdido',
    };
    return statusMap[status] || status;
  }
}

