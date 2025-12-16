import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/lead.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/api/propriedades`;

  constructor(private http: HttpClient) {}

  getProperties(filters?: {
    leadId?: string;
    cultura?: string;
    areaMinima?: number;
  }): Observable<Property[]> {
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

    return this.http.get<Property[]>(this.apiUrl, { params });
  }

  getProperty(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  createProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  updateProperty(
    id: string,
    property: Partial<Property>
  ): Observable<Property> {
    return this.http.patch<Property>(`${this.apiUrl}/${id}`, property);
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

