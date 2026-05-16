// src/app/core/auth/auth.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface MockUser {
  name: string;
  email: string;
  initials: string;
}

const MOCK_USERS: Record<string, { password: string; user: MockUser }> = {
  'alice@techcorp.com': { password: 'admin123', user: { name: 'Alice Johnson', email: 'alice@techcorp.com', initials: 'AJ' } },
  'david@techcorp.com': { password: 'admin123', user: { name: 'David Lee',     email: 'david@techcorp.com', initials: 'DL' } },
  'bob@techcorp.com':   { password: 'user123',  user: { name: 'Bob Smith',     email: 'bob@techcorp.com',   initials: 'BS' } },
  'carol@techcorp.com': { password: 'user123',  user: { name: 'Carol White',   email: 'carol@techcorp.com', initials: 'CW' } },
};

const STORAGE_KEY = 'app_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  currentUser = signal<MockUser | null>(this.loadUser());

  private loadUser(): MockUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): boolean {
    const match = MOCK_USERS[email.toLowerCase()];
    if (match && match.password === password) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
      this.currentUser.set(match.user);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
