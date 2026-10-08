import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service.ts';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = 'Compte créé ! Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de la création du compte';
        this.loading = false;
      },
    });
  }
}
