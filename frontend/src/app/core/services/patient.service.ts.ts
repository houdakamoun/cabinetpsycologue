import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient } from '../../models/patient.model';
import { AuthService } from './auth.service.ts';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private api = `${environment.apiUrl}/patients`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.api, this.auth.getAuthHeaders());
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.api}/${id}`, this.auth.getAuthHeaders());
  }

  addPatient(data: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.api, data, this.auth.getAuthHeaders());
  }

  updatePatient(id: number, data: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.api}/${id}`, data, this.auth.getAuthHeaders());
  }

  deletePatient(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`, this.auth.getAuthHeaders());
  }

  uploadPhoto(patientId: number, file: File): Observable<Patient> {
    const formData = new FormData();
    formData.append('photo', file);

    const token = this.auth.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.http.post<Patient>(`${this.api}/${patientId}/photo`, formData, { headers });
  }

  registerPublic(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    birthDate?: string;
    address?: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/public/register-patient`,
      data,
    );
  }
}
