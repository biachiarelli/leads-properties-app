import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { PropertyDetailComponent } from './property-detail.component';
import { PropertyService } from '../../../../core/services/property.service';
import { Property, Lead, LeadStatus } from '../../../../core/models/lead.model';

describe('PropertyDetailComponent', () => {
  let component: PropertyDetailComponent;
  let fixture: ComponentFixture<PropertyDetailComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;

  const mockLead: Lead = {
    id: '1',
    nome: 'João Silva',
    cpf: '12345678901',
    status: LeadStatus.NOVO,
    municipio: 'São Paulo',
    comentarios: 'Teste',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProperty: Property = {
    id: 'p1',
    culture: 'Soja',
    areaHectares: 150,
    leadId: '1',
    lead: mockLead,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', ['getProperty']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        PropertyDetailComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'p1' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    fixture = TestBed.createComponent(PropertyDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load property on init', () => {
      propertyService.getProperty.and.returnValue(of(mockProperty));

      component.ngOnInit();

      expect(component.propertyId).toBe('p1');
      expect(propertyService.getProperty).toHaveBeenCalledWith('p1');
      expect(component.property).toEqual(mockProperty);
      expect(component.loading).toBeFalse();
    });

    it('should navigate to properties list on error', () => {
      propertyService.getProperty.and.returnValue(throwError(() => new Error('Not found')));

      component.ngOnInit();

      expect(component.loading).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/properties']);
    });
  });

  describe('isPriority', () => {
    it('should return true for priority property', () => {
      component.property = mockProperty;

      expect(component.isPriority()).toBeTrue();
    });

    it('should return false for non-priority property', () => {
      component.property = { ...mockProperty, areaHectares: 50 };

      expect(component.isPriority()).toBeFalse();
    });

    it('should return false when no property', () => {
      component.property = null;

      expect(component.isPriority()).toBeFalse();
    });
  });

  describe('goBack', () => {
    it('should navigate back', () => {
      component.goBack();

      expect(location.back).toHaveBeenCalled();
    });
  });

  describe('viewLead', () => {
    it('should navigate to lead detail', () => {
      component.property = mockProperty;

      component.viewLead();

      expect(router.navigate).toHaveBeenCalledWith(['/leads', '1']);
    });

    it('should not navigate when no property', () => {
      component.property = null;

      component.viewLead();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});

