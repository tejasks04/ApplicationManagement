// src/app/features/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);

  email    = '';
  password = '';
  error    = '';
  loading  = false;

  login(): void {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const ok = this.auth.login(this.email, this.password);
      if (!ok) {
        this.error = 'Invalid email or password. Please try again.';
      }
      this.loading = false;
    }, 600);
  }
}
