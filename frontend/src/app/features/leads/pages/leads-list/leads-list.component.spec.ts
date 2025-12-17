import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';
import { LeadsListComponent } from './leads-list.component';
import { LeadService } from '../../../../core/services/lead.service';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';
import { MessageService, ConfirmationService } from 'primeng/api';

describe('LeadsListComponent', () => {
  let component: LeadsListComponent;
  let fixture: ComponentFixture<LeadsListComponent>;
  let leadService: jasmine.SpyObj<LeadService>;
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

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj('LeadService', [
      'getLeads',
      'createLead',
      'updateLead',
      'deleteLead',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [LeadsListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
      ],
    }).compileComponents();

    leadService = TestBed.inject(LeadService) as jasmine.SpyObj<LeadService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    confirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;

    fixture = TestBed.createComponent(LeadsListComponent);
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
      expect(component.loading).toBeFalse();
    });

  });

  describe('loadLeads', () => {
    it('should load leads with filters', () => {
      component.filterStatus = LeadStatus.NOVO;
      component.filterMunicipio = 'São Paulo';
      leadService.getLeads.and.returnValue(of([mockLead]));

      component.loadLeads();

      expect(leadService.getLeads).toHaveBeenCalledWith({
        status: LeadStatus.NOVO,
        municipio: 'São Paulo',
      });
    });
  });

  describe('openNew', () => {
    it('should open dialog for new lead', () => {
      component.openNew();

      expect(component.selectedLead).toBeNull();
      expect(component.displayDialog).toBeTrue();
    });
  });

  describe('editLead', () => {
    it('should open dialog with selected lead', () => {
      component.editLead(mockLead);

      expect(component.selectedLead).toEqual(mockLead);
      expect(component.displayDialog).toBeTrue();
    });
  });

  describe('isPriority', () => {
    it('should return true for priority lead', () => {
      const priorityLead = {
        ...mockLead,
        properties: [{
          id: 'p1',
          leadId: '1',
          culture: 'Soja',
          areaHectares: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      };
      expect(component.isPriority(priorityLead)).toBe(true);
    });

    it('should return false for non-priority lead', () => {
      const normalLead = {
        ...mockLead,
        properties: [{
          id: 'p1',
          leadId: '1',
          culture: 'Soja',
          areaHectares: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      };
      expect(component.isPriority(normalLead)).toBe(false);
    });
  });
});

