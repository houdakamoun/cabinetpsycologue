import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service.ts';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    this.loading = true;
    this.error = '';

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Identifiants incorrects';
        this.loading = false;
      },
    });
  }
}
