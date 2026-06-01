import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginCredentials } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { UserSession } from '../models/user-session.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  currentUser = signal<UserSession | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user_data', JSON.stringify(res.user))
        this.currentUser.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    this.currentUser.set(null);
  }
}
