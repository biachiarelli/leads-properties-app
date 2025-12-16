import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PropertyService } from '../../../../core/services/property.service';
import { Property } from '../../../../core/models/lead.model';
import { isPriorityArea } from '../../../../shared/utils/property.utils';
import { Location } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PropertyFormComponent } from '../../components/property-form/property-form.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    PropertyFormComponent,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  loading = false;
  propertyId: string | null = null;
  displayDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId) {
      this.loadProperty();
    }
  }

  loadProperty(): void {
    if (!this.propertyId) return;

    this.loading = true;
    this.propertyService.getProperty(this.propertyId).subscribe({
      next: (data) => {
        this.property = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.loading = false;
        this.router.navigate(['/properties']);
      },
    });
  }

  isPriority(): boolean {
    return this.property ? isPriorityArea(this.property.areaHectares) : false;
  }

  goBack(): void {
    this.location.back();
  }

  viewLead(): void {
    if (this.property?.leadId) {
      this.router.navigate(['/leads', this.property.leadId]);
    }
  }
  
  editProperty(): void {
    this.displayDialog = true;
  }

  deleteProperty(property: Property): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a propriedade?`,
      header: 'Confirmar Exclusão',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (property.id) {
          this.propertyService.deleteProperty(property.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Propriedade excluída com sucesso',
              });
              this.loadProperty();
            },
            error: (error) => {
              console.error('Error deleting property:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Erro ao excluir propriedade',
              });
            },
          });
        }
      },
    });
  }

  onSave(): void {
    this.displayDialog = false;
    this.loadProperty();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Propriedade alterada com sucesso',
    });
  }

  onCancel(): void {
    this.displayDialog = false;
  }
}
