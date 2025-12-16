import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { LeadService } from '../../../../core/services/lead.service';
import { Property, Lead } from '../../../../core/models/lead.model';
import { PropertyService } from '../../../../core/services/property.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    Select,
    ButtonModule,
  ],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
})
export class PropertyFormComponent implements OnInit, OnChanges {
  @Input() property: Property | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  formData: Property = {
    leadId: '',
    culture: '',
    areaHectares: 0,
  };

  leads: Lead[] = [];

  constructor(
    private propertyService: PropertyService,
    private leadService: LeadService
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property']) {
      if (this.property) {
        this.formData = { ...this.property };
      } else {
        this.formData = {
          leadId: '',
          culture: '',
          areaHectares: 0,
        };
      }
    }
  }

  loadLeads(): void {
    this.leadService.getLeads().subscribe({
      next: (data) => {
        this.leads = data;
      },
      error: (error) => {
        console.error('Error loading leads:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.property?.id) {
      this.propertyService
        .updateProperty(this.property.id, this.formData)
        .subscribe({
          next: () => {
            this.save.emit();
          },
          error: (error) => {
            console.error('Error updating property:', error);
          },
        });
    } else {
      this.propertyService.createProperty(this.formData).subscribe({
        next: () => {
          this.save.emit();
        },
        error: (error) => {
          console.error('Error creating property:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

