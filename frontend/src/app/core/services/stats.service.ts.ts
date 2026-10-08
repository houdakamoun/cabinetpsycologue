import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../models/appointment.model';
import { AuthService } from './auth.service.ts';

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  completedSessions: number;
  monthlyRevenue: number;
  pendingAppointments: number;
  todayList: Appointment[];
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private api = `${environment.apiUrl}/stats`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.api}/dashboard`, this.auth.getAuthHeaders());
  }
}
