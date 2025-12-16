import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { LeadService } from '../../../../core/services/lead.service';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';
import { getTotalArea, isPriorityLead } from '../../../../shared/utils/property.utils';

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
  ],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.scss'
})
export class LeadDetailComponent implements OnInit {
  lead: Lead | null = null;
  loading = false;
  leadId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService
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
    this.router.navigate(['/leads']);
  }

  editLead(): void {
    // Implementar edição inline ou navegar para formulário
    console.log('Edit lead:', this.leadId);
  }

  viewProperty(propertyId: string): void {
    this.router.navigate(['/properties', propertyId]);
  }
}
