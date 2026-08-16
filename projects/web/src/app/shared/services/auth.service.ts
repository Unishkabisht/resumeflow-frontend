import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  api = environment.apiUrl + '/api/auth';
  apiUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) { }

  signUp(user: any) {
    return this.http.post(this.api + '/register', user);
  }

  logIn(user: any) {
    return this.http.post(this.api + '/login', user);
  }

  forgotPassword(email: string) {
    return this.http.post(this.api + '/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(this.api + '/reset-password', { token, newPassword });
  }

  getUser(): any {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`);
  }

  updateProfile(userData: { fullName: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/me`, userData);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      oldPassword,
      newPassword
    });
  }
}
