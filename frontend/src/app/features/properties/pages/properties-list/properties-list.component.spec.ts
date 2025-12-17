import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PropertiesListComponent } from './properties-list.component';
import { PropertyService } from '../../../../core/services/property.service';
import { Property, Lead, LeadStatus } from '../../../../core/models/lead.model';
import { MessageService, ConfirmationService } from 'primeng/api';

describe('PropertiesListComponent', () => {
  let component: PropertiesListComponent;
  let fixture: ComponentFixture<PropertiesListComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let confirmationService: jasmine.SpyObj<ConfirmationService>;

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
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', [
      'getProperties',
      'createProperty',
      'updateProperty',
      'deleteProperty',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [PropertiesListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
      ],
    }).compileComponents();

    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    confirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;

    fixture = TestBed.createComponent(PropertiesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load properties on init', () => {
      propertyService.getProperties.and.returnValue(of([mockProperty]));

      component.ngOnInit();

      expect(propertyService.getProperties).toHaveBeenCalled();
      expect(component.properties).toEqual([mockProperty]);
      expect(component.loading).toBeFalse();
    });
  });

  describe('loadProperties', () => {
    it('should load properties with filters', () => {
      component.filterCulture = 'Soja';
      component.filterLead = '1';
      component.filterMunicipio = 'São Paulo';
      propertyService.getProperties.and.returnValue(of([mockProperty]));

      component.loadProperties();

      expect(propertyService.getProperties).toHaveBeenCalledWith({
        culture: 'Soja',
        leadId: '1',
        municipio: 'São Paulo',
      });
    });
  });

  describe('openNew', () => {
    it('should open dialog for new property', () => {
      component.openNew();

      expect(component.selectedProperty).toBeNull();
      expect(component.displayDialog).toBeTrue();
    });
  });

  describe('editProperty', () => {
    it('should open dialog with selected property', () => {
      component.editProperty(mockProperty);

      expect(component.selectedProperty).toEqual(mockProperty);
      expect(component.displayDialog).toBeTrue();
    });
  });

  describe('isPriority', () => {
    it('should return true for priority area', () => {
      expect(component.isPriority(150)).toBeTrue();
    });

    it('should return false for non-priority area', () => {
      expect(component.isPriority(50)).toBeFalse();
    });
  });
});

