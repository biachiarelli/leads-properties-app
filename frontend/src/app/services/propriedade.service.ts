import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropriedadeRural } from '../models/lead.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropriedadeService {
  private apiUrl = `${environment.apiUrl}/api/propriedades`;

  constructor(private http: HttpClient) {}

  getPropriedades(filters?: {
    leadId?: string;
    cultura?: string;
    areaMinima?: number;
  }): Observable<PropriedadeRural[]> {
    let params = new HttpParams();

    if (filters?.leadId) {
      params = params.set('leadId', filters.leadId);
    }
    if (filters?.cultura) {
      params = params.set('cultura', filters.cultura);
    }
    if (filters?.areaMinima) {
      params = params.set('areaMinima', filters.areaMinima.toString());
    }

    return this.http.get<PropriedadeRural[]>(this.apiUrl, { params });
  }

  getPropriedade(id: string): Observable<PropriedadeRural> {
    return this.http.get<PropriedadeRural>(`${this.apiUrl}/${id}`);
  }

  createPropriedade(
    propriedade: PropriedadeRural
  ): Observable<PropriedadeRural> {
    return this.http.post<PropriedadeRural>(this.apiUrl, propriedade);
  }

  updatePropriedade(
    id: string,
    propriedade: Partial<PropriedadeRural>
  ): Observable<PropriedadeRural> {
    return this.http.patch<PropriedadeRural>(
      `${this.apiUrl}/${id}`,
      propriedade
    );
  }

  deletePropriedade(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

