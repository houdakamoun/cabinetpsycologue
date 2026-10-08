import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  APPOINTMENT_STATUS_LABELS,
  Appointment,
  AppointmentStatus,
} from '../../../models/appointment.model';
import { Patient } from '../../../models/patient.model';
import { AppointmentService } from '../../../core/services/appointment.service.ts';
import { PatientService } from '../../../core/services/patient.service.ts';

@Component({
  selector: 'app-appointment-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm implements OnInit {
  patients: Patient[] = [];
  appointment: Appointment = {
    patientId: 0,
    startTime: '',
    endTime: '',
    status: 'PENDING',
    notes: '',
    color: '#099078',
    price: 60,
  };
  statuses = Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[];
  statusLabels = APPOINTMENT_STATUS_LABELS;
  isEdit = false;
  appointmentId?: number;
  loading = false;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.patientService.getAllPatients().subscribe((data) => {
      this.patients = data;
      if (data.length && !this.appointment.patientId) {
        this.appointment.patientId = data[0].id!;
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.appointmentId = +id;
      this.appointmentService.getById(this.appointmentId).subscribe((data) => {
        this.appointment = {
          ...data,
          startTime: this.toLocalInput(data.startTime),
          endTime: this.toLocalInput(data.endTime),
        };
      });
    }
  }

  toLocalInput(iso: string): string {
    const d = new Date(iso);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  submit(): void {
    this.loading = true;
    const payload = {
      ...this.appointment,
      startTime: new Date(this.appointment.startTime).toISOString(),
      endTime: new Date(this.appointment.endTime).toISOString(),
    };

    const request = this.isEdit && this.appointmentId
      ? this.appointmentService.update(this.appointmentId, payload)
      : this.appointmentService.create(payload);

    request.subscribe({
      next: () => this.router.navigate(['/admin/rendez-vous']),
      error: () => {
        this.loading = false;
      },
    });
  }
}
