import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  Appointment,
} from '../../../models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service.ts';

@Component({
  selector: 'app-appointment-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  statusLabels = APPOINTMENT_STATUS_LABELS;
  statusColors = APPOINTMENT_STATUS_COLORS;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  updateStatus(id: number, status: Appointment['status']): void {
    this.appointmentService.update(id, { status }).subscribe(() => this.load());
  }

  deleteAppointment(id: number): void {
    if (!confirm('Annuler ce rendez-vous ?')) return;
    this.appointmentService.delete(id).subscribe(() => this.load());
  }
}
