import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { LeadDetailComponent } from './lead-detail.component';
import { LeadService } from '../../../../core/services/lead.service';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';

describe('LeadDetailComponent', () => {
  let component: LeadDetailComponent;
  let fixture: ComponentFixture<LeadDetailComponent>;
  let leadService: jasmine.SpyObj<LeadService>;
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
    properties: [
      {
        id: 'p1',
        culture: 'Soja',
        areaHectares: 150,
        leadId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj('LeadService', ['getLead']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [LeadDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    leadService = TestBed.inject(LeadService) as jasmine.SpyObj<LeadService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    fixture = TestBed.createComponent(LeadDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load lead on init', () => {
      leadService.getLead.and.returnValue(of(mockLead));

      component.ngOnInit();

      expect(component.leadId).toBe('1');
      expect(leadService.getLead).toHaveBeenCalledWith('1');
      expect(component.lead).toEqual(mockLead);
      expect(component.loading).toBeFalse();
    });

    it('should navigate to leads list on error', () => {
      leadService.getLead.and.returnValue(throwError(() => new Error('Not found')));

      component.ngOnInit();

      expect(component.loading).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/leads']);
    });
  });

  describe('getTotalArea', () => {
    it('should calculate total area from properties', () => {
      component.lead = mockLead;

      const totalArea = component.getTotalArea();

      expect(totalArea).toBe(150);
    });

    it('should return 0 when no lead', () => {
      component.lead = null;

      const totalArea = component.getTotalArea();

      expect(totalArea).toBe(0);
    });
  });

  describe('isPriority', () => {
    it('should return true for priority lead', () => {
      component.lead = mockLead;

      expect(component.isPriority()).toBeTrue();
    });

    it('should return false for non-priority lead', () => {
      component.lead = {
        ...mockLead,
        properties: [{ ...mockLead.properties![0], areaHectares: 50 }],
      };

      expect(component.isPriority()).toBeFalse();
    });
  });

  describe('getStatusSeverity', () => {
    it('should return correct severity for each status', () => {
      expect(component.getStatusSeverity(LeadStatus.NOVO)).toBe('info');
      expect(component.getStatusSeverity(LeadStatus.CONTATO_INICIAL)).toBe('secondary');
      expect(component.getStatusSeverity(LeadStatus.EM_NEGOCIACAO)).toBe('warn');
      expect(component.getStatusSeverity(LeadStatus.CONVERTIDO)).toBe('success');
      expect(component.getStatusSeverity(LeadStatus.PERDIDO)).toBe('danger');
    });
  });

  describe('goBack', () => {
    it('should navigate back', () => {
      component.goBack();

      expect(location.back).toHaveBeenCalled();
    });
  });

  describe('viewProperty', () => {
    it('should navigate to property detail', () => {
      component.viewProperty('p1');

      expect(router.navigate).toHaveBeenCalledWith(['/properties', 'p1']);
    });
  });
});

