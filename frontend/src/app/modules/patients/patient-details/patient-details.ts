import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  Appointment,
} from '../../../models/appointment.model';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../core/services/patient.service.ts';
import { SessionNote, SessionNoteService } from '../../../core/services/session-note.service';

import { getPatientPhotoUrl } from '../../../core/utils/patient-photo';

@Component({
  selector: 'app-patient-details',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.css',
})
export class PatientDetails implements OnInit {
  patient?: Patient & { appointments?: Appointment[] };
  notes: SessionNote[] = [];
  newNote = '';
  statusLabels = APPOINTMENT_STATUS_LABELS;
  statusColors = APPOINTMENT_STATUS_COLORS;

  get patientPhotoUrl(): string | null {
    return getPatientPhotoUrl(this.patient?.photo);
  }

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private noteService: SessionNoteService,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.patientService.getPatient(id).subscribe((data) => {
      this.patient = data as Patient & { appointments?: Appointment[] };
    });
    this.noteService.getByPatient(id).subscribe((data) => {
      this.notes = data;
    });
  }

  addNote(): void {
    if (!this.newNote.trim() || !this.patient?.id) return;
    this.noteService
      .create({ patientId: this.patient.id, content: this.newNote, isPrivate: true })
      .subscribe((note) => {
        this.notes.unshift(note);
        this.newNote = '';
      });
  }
}
