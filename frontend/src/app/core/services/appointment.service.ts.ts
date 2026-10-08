import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../models/appointment.model';
import { AuthService } from './auth.service.ts';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private api = `${environment.apiUrl}/appointments`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getAll(params?: { start?: string; end?: string; status?: string }): Observable<Appointment[]> {
    const query = new URLSearchParams();
    if (params?.start) query.set('start', params.start);
    if (params?.end) query.set('end', params.end);
    if (params?.status) query.set('status', params.status);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.http.get<Appointment[]>(`${this.api}${suffix}`, this.auth.getAuthHeaders());
  }

  getById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.api}/${id}`, this.auth.getAuthHeaders());
  }

  create(data: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.api, data, this.auth.getAuthHeaders());
  }

  update(id: number, data: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/${id}`, data, this.auth.getAuthHeaders());
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`, this.auth.getAuthHeaders());
  }
}
