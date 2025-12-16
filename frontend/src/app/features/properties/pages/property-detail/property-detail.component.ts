import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PropertyService } from '../../../../core/services/property.service';
import { Property } from '../../../../core/models/lead.model';
import { isPriorityArea } from '../../../../shared/utils/property.utils';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  loading = false;
  propertyId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
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
    this.router.navigate(['/properties']);
  }

  viewLead(): void {
    if (this.property?.leadId) {
      this.router.navigate(['/leads', this.property.leadId]);
    }
  }

  editProperty(): void {
    console.log('Edit property:', this.propertyId);
  }
}
