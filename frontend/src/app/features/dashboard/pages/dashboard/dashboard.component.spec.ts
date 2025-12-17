import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../../../core/services/dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  let router: jasmine.SpyObj<Router>;

  const mockMetrics = {
    totalLeads: 100,
    leadsByStatus: [
      { status: 'NOVO', count: 30 },
      { status: 'CONTATO_INICIAL', count: 25 },
      { status: 'EM_NEGOCIACAO', count: 20 },
      { status: 'CONVERTIDO', count: 15 },
      { status: 'PERDIDO', count: 10 },
    ],
    leadsByMunicipio: [
      { municipio: 'São Paulo', count: 40 },
      { municipio: 'Rio de Janeiro', count: 30 },
      { municipio: 'Belo Horizonte', count: 30 },
    ],
    priorityLeads: [
      {
        id: '1',
        nome: 'João Silva',
        totalAreaHectares: 250,
        qtdProperties: 2,
      },
    ],
  };

  beforeEach(async () => {
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['getMetrics']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load metrics on init', () => {
      dashboardService.getMetrics.and.returnValue(of(mockMetrics));

      component.ngOnInit();

      expect(dashboardService.getMetrics).toHaveBeenCalled();
      expect(component.metrics).toEqual(mockMetrics);
    });
  });

  describe('viewLead', () => {
    it('should navigate to lead detail', () => {
      component.viewLead('1');

      expect(router.navigate).toHaveBeenCalledWith(['/leads', '1']);
    });
  });
});

