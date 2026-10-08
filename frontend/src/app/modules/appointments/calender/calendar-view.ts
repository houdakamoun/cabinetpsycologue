import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  Appointment,
} from '../../../models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service.ts';

type ViewMode = 'day' | 'week' | 'month';

@Component({
  selector: 'app-calendar-view',
  imports: [RouterLink, DatePipe],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})
export class CalendarView implements OnInit {
  appointments: Appointment[] = [];
  currentDate = new Date();
  view: ViewMode = 'week';
  statusLabels = APPOINTMENT_STATUS_LABELS;
  statusColors = APPOINTMENT_STATUS_COLORS;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const start = new Date(this.currentDate);
    start.setDate(start.getDate() - 30);
    const end = new Date(this.currentDate);
    end.setDate(end.getDate() + 30);

    this.appointmentService
      .getAll({ start: start.toISOString(), end: end.toISOString() })
      .subscribe((data) => {
        this.appointments = data;
      });
  }

  setView(view: ViewMode): void {
    this.view = view;
  }

  prev(): void {
    const d = new Date(this.currentDate);
    if (this.view === 'day') d.setDate(d.getDate() - 1);
    else if (this.view === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    this.currentDate = d;
    this.loadAppointments();
  }

  next(): void {
    const d = new Date(this.currentDate);
    if (this.view === 'day') d.setDate(d.getDate() + 1);
    else if (this.view === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    this.currentDate = d;
    this.loadAppointments();
  }

  get filteredAppointments(): Appointment[] {
    const start = new Date(this.currentDate);
    start.setHours(0, 0, 0, 0);
    let end = new Date(start);

    if (this.view === 'day') {
      end.setDate(end.getDate() + 1);
    } else if (this.view === 'week') {
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - day + 1);
      end = new Date(start);
      end.setDate(end.getDate() + 7);
    } else {
      start.setDate(1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    }

    return this.appointments.filter((a) => {
      const t = new Date(a.startTime);
      return t >= start && t < end;
    });
  }
}
