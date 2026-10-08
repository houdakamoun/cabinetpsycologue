import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PatientService } from '../../core/services/patient.service.ts';

@Component({
  selector: 'app-patient-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './patient-signup.html',
  styleUrl: './patient-signup.css',
})
export class PatientSignup {
  private patientService = inject(PatientService);
  private cdr = inject(ChangeDetectorRef);

  form = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
  };

  loading = signal(false);
  error = signal('');
  success = signal(false);

  submit(): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService
      .registerPublic(this.form)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.success.set(true);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Erreur lors de l\'inscription');
          this.cdr.markForCheck();
        },
      });
  }
}
