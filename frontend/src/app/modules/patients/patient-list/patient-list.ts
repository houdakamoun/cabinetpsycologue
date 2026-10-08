import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../core/services/patient.service.ts';

import { getPatientPhotoUrl } from '../../../core/utils/patient-photo';

@Component({
  selector: 'app-patient-list',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientList implements OnInit, OnDestroy {
  private patientService = inject(PatientService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private navSub?: Subscription;

  patients = signal<Patient[]>([]);
  loading = signal(true);
  error = signal('');
  search = '';

  ngOnInit(): void {
    this.loadPatients();

    this.navSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        if (url === '/admin/patients' || url.startsWith('/admin/patients?')) {
          this.loadPatients();
        }
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  loadPatients(): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients.set(data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error.set(
          err.status === 401
            ? 'Session expirée. Veuillez vous reconnecter.'
            : 'Impossible de charger les patients.',
        );
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  get filteredPatients(): Patient[] {
    const q = this.search.toLowerCase().trim();
    const list = this.patients();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.includes(q),
    );
  }

  deletePatient(id: number): void {
    if (!confirm('Supprimer ce patient ?')) return;
    this.patientService.deletePatient(id).subscribe({
      next: () => this.loadPatients(),
      error: () => this.error.set('Erreur lors de la suppression'),
    });
  }

  photoUrl(patient: Patient): string | null {
    return getPatientPhotoUrl(patient.photo);
  }
}
