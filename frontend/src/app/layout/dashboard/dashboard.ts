import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
} from '../../models/appointment.model';
import { DashboardStats, StatsService } from '../../core/services/stats.service.ts';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private statsService = inject(StatsService);
  private cdr = inject(ChangeDetectorRef);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal('');
  statusLabels = APPOINTMENT_STATUS_LABELS;
  statusColors = APPOINTMENT_STATUS_COLORS;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.error.set('');

    this.statsService.getDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error.set(
          err.status === 401
            ? 'Session expirée. Reconnectez-vous.'
            : 'Impossible de charger le tableau de bord.',
        );
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
