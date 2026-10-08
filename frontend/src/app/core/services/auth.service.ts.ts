import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../models/user.model';

const STORAGE_KEY = 'psy_cabinet_auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, data).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  register(data: { email: string; password: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/register`, data);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  }

  getToken(): string | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw).token;
    } catch {
      return null;
    }
  }

  getUser() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw).user;
    } catch {
      return null;
    }
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token.length > 20;
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
