import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Payment, PAYMENT_STATUS_LABELS, PaymentStatus } from '../../../models/payment.model';
import { PaymentService } from '../../../core/services/payment.service.ts';
import { PatientService } from '../../../core/services/patient.service.ts';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-payment-list',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
})
export class PaymentList implements OnInit {
  payments: Payment[] = [];
  patients: Patient[] = [];
  loading = true;
  statusLabels = PAYMENT_STATUS_LABELS;
  showForm = false;
  newPayment: Payment = {
    patientId: 0,
    amount: 60,
    status: 'UNPAID',
    notes: '',
  };

  constructor(
    private paymentService: PaymentService,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.patientService.getAllPatients().subscribe((data) => {
      this.patients = data;
      if (data.length) this.newPayment.patientId = data[0].id!;
    });
  }

  load(): void {
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  togglePaid(payment: Payment): void {
    const newStatus: PaymentStatus = payment.status === 'PAID' ? 'UNPAID' : 'PAID';
    this.paymentService.update(payment.id!, { status: newStatus }).subscribe(() => this.load());
  }

  createPayment(): void {
    this.paymentService.create(this.newPayment).subscribe(() => {
      this.showForm = false;
      this.load();
    });
  }

  get totalPaid(): number {
    return this.payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.amount, 0);
  }

  get totalUnpaid(): number {
    return this.payments.filter((p) => p.status !== 'PAID').reduce((s, p) => s + p.amount, 0);
  }
}
