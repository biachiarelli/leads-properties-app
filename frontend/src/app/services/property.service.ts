import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/lead.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/api/properties`;

  constructor(private http: HttpClient) {}

  getProperties(filters?: {
    leadId?: string;
    culture?: string;
    minArea?: number;
  }): Observable<Property[]> {
    let params = new HttpParams();

    if (filters?.leadId) {
      params = params.set('leadId', filters.leadId);
    }
    if (filters?.culture) {
      params = params.set('culture', filters.culture);
    }
    if (filters?.minArea) {
      params = params.set('minArea', filters.minArea.toString());
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

