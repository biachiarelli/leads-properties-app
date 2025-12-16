import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { LeadService } from '../../../../core/services/lead.service';
import { Lead, LeadStatus, Property } from '../../../../core/models/lead.model';
import { getTotalArea, isPriorityLead } from '../../../../shared/utils/property.utils';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LeadFormComponent } from '../../components/lead-form/lead-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PropertyFormComponent } from '../../../properties/components/property-form/property-form.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    LeadFormComponent,
    PropertyFormComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.scss'
})
export class LeadDetailComponent implements OnInit {
  lead: Lead | null = null;
  loading = false;
  leadId: string | null = null;
  displayDialog = false;
  displayPropertyDialog = false;
  defaultProperty: Property | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.loadLead();
    }
  }

  loadLead(): void {
    if (!this.leadId) return;

    this.loading = true;
    this.leadService.getLead(this.leadId).subscribe({
      next: (data) => {
        this.lead = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading lead:', error);
        this.loading = false;
        this.router.navigate(['/leads']);
      },
    });
  }

  getTotalArea(): number {
    return this.lead ? getTotalArea(this.lead) : 0;
  }

  isPriority(): boolean {
    return this.lead ? isPriorityLead(this.lead) : false;
  }

  getStatusSeverity(status: LeadStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const severityMap: Record<LeadStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      [LeadStatus.NOVO]: 'info',
      [LeadStatus.CONTATO_INICIAL]: 'secondary',
      [LeadStatus.EM_NEGOCIACAO]: 'warn',
      [LeadStatus.CONVERTIDO]: 'success',
      [LeadStatus.PERDIDO]: 'danger',
    };
    return severityMap[status];
  }

  getStatusLabel(status: LeadStatus): string {
    const labelMap: Record<LeadStatus, string> = {
      [LeadStatus.NOVO]: 'Novo',
      [LeadStatus.CONTATO_INICIAL]: 'Contato Inicial',
      [LeadStatus.EM_NEGOCIACAO]: 'Em Negociação',
      [LeadStatus.CONVERTIDO]: 'Convertido',
      [LeadStatus.PERDIDO]: 'Perdido',
    };
    return labelMap[status];
  }

  goBack(): void {
  this.location.back();
  }

  viewProperty(propertyId: string): void {
    this.router.navigate(['/properties', propertyId]);
  }

  addProperty(): void {
    this.defaultProperty = {
      leadId: this.leadId!,
      culture: '',
      areaHectares: 0,
    };
    this.displayPropertyDialog = true;
  }
  
  editLead(): void {
    this.displayDialog = true;
  }

  deleteLead(): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o lead ${this.lead?.nome}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (this.lead?.id) {
          this.leadService.deleteLead(this.lead?.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Lead excluído com sucesso',
              });
              this.loadLead();
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
    this.loadLead();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Lead salvo com sucesso',
    });
  }

  onSaveProperty(): void {
    this.displayPropertyDialog = false;
    this.loadLead();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Propriedade salva com sucesso',
    });
  }

  onCancel(): void {
    this.displayDialog = false;
    this.displayPropertyDialog = false;
  }
}
