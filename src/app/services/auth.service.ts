import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import{User} from '../models/user'
import{LoginRequest} from '../models/login-request'
import{LoginResponse} from '../models/login-response'
import{RegisterRequest} from '../models/register-request'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7000/api'; // URL الخاص بالـ backend
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is logged in on service initialization
    const token = this.getToken();
    if (token) {
      // Decode token and set current user if needed
      // For now, we'll just check if token exists
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Here you could add token expiration check
    return true;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  updateProfile(profileData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/profile`, profileData, { headers });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    }, { headers });
  }

  exportUserData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/export-data`, { headers });
  }

  deactivateAccount(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/deactivate`, {}, { headers });
  }

  deleteAccount(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete-account`, { headers });
  }
}
