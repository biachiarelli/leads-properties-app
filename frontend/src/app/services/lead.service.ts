import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead, LeadStatus } from '../models/lead.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private apiUrl = `${environment.apiUrl}/api/leads`;

  constructor(private http: HttpClient) {}

  getLeads(filters?: {
    nome?: string;
    status?: LeadStatus;
    municipio?: string;
  }): Observable<Lead[]> {
    let params = new HttpParams();

    if (filters?.nome) {
      params = params.set('nome', filters.nome);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.municipio) {
      params = params.set('municipio', filters.municipio);
    }

    return this.http.get<Lead[]>(this.apiUrl, { params });
  }

  getLead(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  createLead(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead);
  }

  updateLead(id: string, lead: Partial<Lead>): Observable<Lead> {
    return this.http.patch<Lead>(`${this.apiUrl}/${id}`, lead);
  }

  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

