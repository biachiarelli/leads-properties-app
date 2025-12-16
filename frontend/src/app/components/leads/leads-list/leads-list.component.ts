import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LeadService } from '../../../services/lead.service';
import { Lead, LeadStatus } from '../../../models/lead.model';
import { LeadFormComponent } from '../lead-form/lead-form.component';

@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    Select,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    LeadFormComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss'],
})
export class LeadsListComponent implements OnInit {
  leads: Lead[] = [];
  loading = false;
  displayDialog = false;
  selectedLead: Lead | null = null;

  // Filtros
  filterNome = '';
  filterStatus: LeadStatus | null = null;
  filterMunicipio = '';

  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Novo', value: LeadStatus.NOVO },
    { label: 'Contato Inicial', value: LeadStatus.CONTATO_INICIAL },
    { label: 'Em Negociação', value: LeadStatus.EM_NEGOCIACAO },
    { label: 'Convertido', value: LeadStatus.CONVERTIDO },
    { label: 'Perdido', value: LeadStatus.PERDIDO },
  ];

  constructor(
    private leadService: LeadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    this.loading = true;
    const filters: any = {};

    if (this.filterNome) filters.nome = this.filterNome;
    if (this.filterStatus) filters.status = this.filterStatus;
    if (this.filterMunicipio) filters.municipio = this.filterMunicipio;

    this.leadService.getLeads(filters).subscribe({
      next: (data) => {
        this.leads = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar leads:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar leads',
        });
        this.loading = false;
      },
    });
  }

  openNew(): void {
    this.selectedLead = null;
    this.displayDialog = true;
  }

  editLead(lead: Lead): void {
    this.selectedLead = { ...lead };
    this.displayDialog = true;
  }

  deleteLead(lead: Lead): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o lead ${lead.nome}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (lead.id) {
          this.leadService.deleteLead(lead.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Lead excluído com sucesso',
              });
              this.loadLeads();
            },
            error: (error) => {
              console.error('Erro ao excluir lead:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir lead',
              });
            },
          });
        }
      },
    });
  }

  onSave(): void {
    this.displayDialog = false;
    this.loadLeads();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Lead salvo com sucesso',
    });
  }

  onCancel(): void {
    this.displayDialog = false;
  }

  getStatusSeverity(
    status: LeadStatus
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severityMap: {
      [key: string]:
        | 'success'
        | 'secondary'
        | 'info'
        | 'warn'
        | 'danger'
        | 'contrast';
    } = {
      novo: 'info',
      contato_inicial: 'secondary',
      em_negociacao: 'warn',
      convertido: 'success',
      perdido: 'danger',
    };
    return severityMap[status] || 'info';
  }

  formatStatus(status: LeadStatus): string {
    const statusMap: { [key: string]: string } = {
      novo: 'Novo',
      contato_inicial: 'Contato Inicial',
      em_negociacao: 'Em Negociação',
      convertido: 'Convertido',
      perdido: 'Perdido',
    };
    return statusMap[status] || status;
  }

  getTotalArea(lead: Lead): number {
    if (!lead.properties || lead.properties.length === 0) {
      return 0;
    }
    return lead.properties.reduce(
      (sum, p) => sum + Number(p.areaHectares || 0),
      0
    );
  }

  isPrioritario(lead: Lead): boolean {
    return this.getTotalArea(lead) > 100;
  }
}

