import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PropertyFormComponent } from './property-form.component';
import { PropertyService } from '../../../../core/services/property.service';
import { LeadService } from '../../../../core/services/lead.service';
import { Property, Lead, LeadStatus } from '../../../../core/models/lead.model';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let leadService: jasmine.SpyObj<LeadService>;

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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', [
      'createProperty',
      'updateProperty',
    ]);
    const leadServiceSpy = jasmine.createSpyObj('LeadService', ['getLeads']);

    await TestBed.configureTestingModule({
      imports: [PropertyFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: LeadService, useValue: leadServiceSpy },
      ],
    }).compileComponents();

    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    leadService = TestBed.inject(LeadService) as jasmine.SpyObj<LeadService>;

    fixture = TestBed.createComponent(PropertyFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load leads on init', () => {
      leadService.getLeads.and.returnValue(of([mockLead]));

      component.ngOnInit();

      expect(leadService.getLeads).toHaveBeenCalled();
      expect(component.leads).toEqual([mockLead]);
    });
  });

  describe('ngOnChanges', () => {
    it('should populate formData when property is provided', () => {
      component.property = mockProperty;
      component.ngOnChanges({
        property: {
          currentValue: mockProperty,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.formData.culture).toBe(mockProperty.culture);
      expect(component.formData.areaHectares).toBe(mockProperty.areaHectares);
      expect(component.formData.leadId).toBe(mockProperty.leadId);
    });

    it('should reset formData when property is null', () => {
      component.property = null;
      component.ngOnChanges({
        property: {
          currentValue: null,
          previousValue: mockProperty,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.formData.culture).toBe('');
      expect(component.formData.areaHectares).toBe(0);
      expect(component.formData.leadId).toBe('');
    });
  });

  describe('onSubmit', () => {
    it('should update property when property.id exists', () => {
      component.property = mockProperty;
      component.formData = { ...mockProperty, culture: 'Milho' };
      propertyService.updateProperty.and.returnValue(of(component.formData));
      spyOn(component.save, 'emit');

      component.onSubmit();

      expect(propertyService.updateProperty).toHaveBeenCalledWith('p1', {
        leadId: mockProperty.leadId,
        culture: 'Milho',
        areaHectares: 150,
      });
      expect(component.save.emit).toHaveBeenCalled();
    });

    it('should create property when property.id does not exist', () => {
      component.property = null;
      component.formData = {
        leadId: '1',
        culture: 'Café',
        areaHectares: 80,
      };
      propertyService.createProperty.and.returnValue(of(component.formData as Property));
      spyOn(component.save, 'emit');

      component.onSubmit();

      expect(propertyService.createProperty).toHaveBeenCalledWith({
        leadId: '1',
        culture: 'Café',
        areaHectares: 80,
      });
      expect(component.save.emit).toHaveBeenCalled();
    });

    it('should convert areaHectares to number', () => {
      component.property = null;
      component.formData = {
        leadId: '1',
        culture: 'Soja',
        areaHectares: '100' as any, // Simulating string input
      };
      propertyService.createProperty.and.returnValue(of(mockProperty));
      spyOn(component.save, 'emit');

      component.onSubmit();

      expect(propertyService.createProperty).toHaveBeenCalledWith({
        leadId: '1',
        culture: 'Soja',
        areaHectares: 100, // Should be converted to number
      });
    });
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });
});

