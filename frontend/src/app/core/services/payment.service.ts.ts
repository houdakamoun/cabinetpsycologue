import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment } from '../../models/payment.model';
import { AuthService } from './auth.service.ts';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private api = `${environment.apiUrl}/payments`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getAll(status?: string): Observable<Payment[]> {
    const suffix = status ? `?status=${status}` : '';
    return this.http.get<Payment[]>(`${this.api}${suffix}`, this.auth.getAuthHeaders());
  }

  create(data: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.api, data, this.auth.getAuthHeaders());
  }

  update(id: number, data: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.api}/${id}`, data, this.auth.getAuthHeaders());
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`, this.auth.getAuthHeaders());
  }
}
