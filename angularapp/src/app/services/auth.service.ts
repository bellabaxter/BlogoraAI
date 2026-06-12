import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginResponse, User } from '../models/user.model';
import { API_BASE_URL, TOKEN_KEY } from '../app.constants';

const AUTHENTICATED_EMAIL = 'authenticatedEmail';
const USER_NAME = 'userName';
const TOKEN = 'token';
const PAGE_ID = 'pageId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/register`, user);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password }).pipe(
      map(data => {
        localStorage.setItem(USER_NAME, data.name);
        localStorage.setItem(AUTHENTICATED_EMAIL, data.email);
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
      })
    );
  }

  isLoggedIn(): boolean {
    let user = localStorage.getItem(AUTHENTICATED_EMAIL);
    return !(user == null);
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserName(): string | null {
    return localStorage.getItem(USER_NAME);
  }

  getAuthenticatedEmail(): string | null {
    return localStorage.getItem(AUTHENTICATED_EMAIL);
  }

  getAuthenticatedToken(): string | null {
    if (this.getAuthenticatedEmail())
      return localStorage.getItem(TOKEN);
    return null;
  }

  pageId(): string {
    let pageId = localStorage.getItem(PAGE_ID);
    if (pageId === null) {
      localStorage.setItem(PAGE_ID, 'login');
      return 'login';
    }
    return pageId;
  }

  setPageId(pageId: string): void {
    localStorage.setItem(PAGE_ID, pageId);
  }
}