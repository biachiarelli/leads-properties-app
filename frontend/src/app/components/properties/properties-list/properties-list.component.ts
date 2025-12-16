import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../models/lead.model';
import { PropertyFormComponent } from '../property-form/property-form.component';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    PropertyFormComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit {
  properties: Property[] = [];
  loading = false;
  displayDialog = false;
  selectedProperty: Property | null = null;

  filterCulture = '';
  filterMinArea: number | null = null;

  constructor(
    private propertyService: PropertyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    const filters: any = {};

    if (this.filterCulture) filters.culture = this.filterCulture;
    if (this.filterMinArea) filters.minArea = this.filterMinArea;

    this.propertyService.getProperties(filters).subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading properties',
        });
        this.loading = false;
      },
    });
  }

  openNew(): void {
    this.selectedProperty = null;
    this.displayDialog = true;
  }

  editProperty(property: Property): void {
    this.selectedProperty = { ...property };
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
                summary: 'Success',
                detail: 'Propriedade excluída com sucesso',
              });
              this.loadProperties();
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
    this.loadProperties();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Property saved successfully',
    });
  }

  onCancel(): void {
    this.displayDialog = false;
  }

  isPriority(area: number): boolean {
    return area > 100;
  }
}

