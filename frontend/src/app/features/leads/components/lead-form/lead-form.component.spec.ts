import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LeadFormComponent } from './lead-form.component';
import { LeadService } from '../../../../core/services/lead.service';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';

describe('LeadFormComponent', () => {
  let component: LeadFormComponent;
  let fixture: ComponentFixture<LeadFormComponent>;
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

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj('LeadService', [
      'createLead',
      'updateLead',
    ]);

    await TestBed.configureTestingModule({
      imports: [LeadFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LeadService, useValue: leadServiceSpy },
      ],
    }).compileComponents();

    leadService = TestBed.inject(LeadService) as jasmine.SpyObj<LeadService>;

    fixture = TestBed.createComponent(LeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should populate formData when lead is provided', () => {
      component.lead = mockLead;
      component.ngOnChanges({
        lead: {
          currentValue: mockLead,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.formData.nome).toBe(mockLead.nome);
      expect(component.formData.cpf).toBe(mockLead.cpf);
      expect(component.formData.status).toBe(mockLead.status);
    });

    it('should reset formData when lead is null', () => {
      component.lead = null;
      component.ngOnChanges({
        lead: {
          currentValue: null,
          previousValue: mockLead,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.formData.nome).toBe('');
      expect(component.formData.cpf).toBe('');
      expect(component.formData.status).toBe(LeadStatus.NOVO);
    });
  });

  describe('onSubmit', () => {
    it('should update lead when lead.id exists', () => {
      component.lead = mockLead;
      component.formData = { ...mockLead, nome: 'Updated Name' };
      leadService.updateLead.and.returnValue(of(component.formData as Lead));
      spyOn(component.save, 'emit');

      component.onSubmit();

      expect(leadService.updateLead).toHaveBeenCalledWith('1', {
        nome: 'Updated Name',
        cpf: mockLead.cpf,
        status: mockLead.status,
        comentarios: mockLead.comentarios,
        municipio: mockLead.municipio,
      });
      expect(component.save.emit).toHaveBeenCalled();
    });

    it('should create lead when lead.id does not exist', () => {
      component.lead = null;
      component.formData = {
        nome: 'New Lead',
        cpf: '98765432100',
        status: LeadStatus.NOVO,
        comentarios: '',
        municipio: 'Rio de Janeiro',
      };
      leadService.createLead.and.returnValue(of(component.formData as Lead));
      spyOn(component.save, 'emit');

      component.onSubmit();

      expect(leadService.createLead).toHaveBeenCalledWith({
        nome: 'New Lead',
        cpf: '98765432100',
        status: LeadStatus.NOVO,
        comentarios: '',
        municipio: 'Rio de Janeiro',
      });
      expect(component.save.emit).toHaveBeenCalled();
    });

    it('should handle error on update', () => {
      component.lead = mockLead;
      leadService.updateLead.and.returnValue(throwError(() => new Error('Update failed')));
      spyOn(console, 'error');

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Erro ao atualizar lead:', jasmine.any(Error));
    });

    it('should handle error on create', () => {
      component.lead = null;
      leadService.createLead.and.returnValue(throwError(() => new Error('Create failed')));
      spyOn(console, 'error');

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Erro ao criar lead:', jasmine.any(Error));
    });
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('statusOptions', () => {
    it('should have all status options', () => {
      expect(component.statusOptions.length).toBe(5);
      expect(component.statusOptions[0].value).toBe(LeadStatus.NOVO);
      expect(component.statusOptions[1].value).toBe(LeadStatus.CONTATO_INICIAL);
      expect(component.statusOptions[2].value).toBe(LeadStatus.EM_NEGOCIACAO);
      expect(component.statusOptions[3].value).toBe(LeadStatus.CONVERTIDO);
      expect(component.statusOptions[4].value).toBe(LeadStatus.PERDIDO);
    });
  });
});

