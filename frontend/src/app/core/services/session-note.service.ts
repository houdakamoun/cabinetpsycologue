import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service.ts';

export interface SessionNote {
  id?: number;
  patientId: number;
  appointmentId?: number;
  content: string;
  isPrivate?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionNoteService {
  private api = `${environment.apiUrl}/session-notes`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getByPatient(patientId: number): Observable<SessionNote[]> {
    return this.http.get<SessionNote[]>(
      `${this.api}/patient/${patientId}`,
      this.auth.getAuthHeaders(),
    );
  }

  create(data: SessionNote): Observable<SessionNote> {
    return this.http.post<SessionNote>(this.api, data, this.auth.getAuthHeaders());
  }

  update(id: number, data: Partial<SessionNote>): Observable<SessionNote> {
    return this.http.put<SessionNote>(`${this.api}/${id}`, data, this.auth.getAuthHeaders());
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`, this.auth.getAuthHeaders());
  }
}
