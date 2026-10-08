import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../core/services/patient.service.ts';
import { getPatientPhotoUrl } from '../../../core/utils/patient-photo';

@Component({
  selector: 'app-patient-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css',
})
export class PatientForm implements OnInit {
  private patientService = inject(PatientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  patient: Patient = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    birthDate: '',
    age: undefined,
    address: '',
    notes: '',
    photo: '',
  };
  isEdit = false;
  patientId?: number;
  loading = false;
  error = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.patientId = +id;
      this.patientService.getPatient(this.patientId).subscribe({
        next: (data) => {
          this.patient = {
            ...data,
            birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
          };
          this.photoPreview = getPatientPhotoUrl(data.photo);
          this.cdr.markForCheck();
        },
      });
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      this.error = 'Format accepté : PNG, JPEG ou JPG uniquement';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error = 'L\'image ne doit pas dépasser 5 Mo';
      input.value = '';
      return;
    }

    this.error = '';
    this.photoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoFile = null;
    this.photoPreview = this.isEdit ? getPatientPhotoUrl(this.patient.photo) : null;
    if (!this.isEdit || !this.patient.photo) {
      this.photoPreview = null;
    }
  }

  submit(): void {
    this.loading = true;
    this.error = '';

    const payload: Patient = {
      firstName: this.patient.firstName.trim(),
      lastName: this.patient.lastName.trim(),
      phone: this.patient.phone.trim(),
      email: this.patient.email?.trim() || undefined,
      address: this.patient.address?.trim() || undefined,
      notes: this.patient.notes?.trim() || undefined,
      birthDate: this.patient.birthDate || undefined,
    };

    if (payload.birthDate) {
      const birth = new Date(payload.birthDate);
      const today = new Date();
      payload.age = today.getFullYear() - birth.getFullYear();
    }

    const save$ =
      this.isEdit && this.patientId
        ? this.patientService.updatePatient(this.patientId, payload)
        : this.patientService.addPatient(payload);

    save$
      .pipe(
        switchMap((saved) => {
          if (this.photoFile && saved.id) {
            return this.patientService.uploadPhoto(saved.id, this.photoFile);
          }
          return of(saved);
        }),
      )
      .subscribe({
        next: () => this.router.navigate(['/admin/patients']),
        error: (err) => {
          this.error = err.error?.error || 'Erreur lors de l\'enregistrement';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
