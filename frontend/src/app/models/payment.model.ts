export type PaymentStatus = 'PAID' | 'UNPAID' | 'PARTIAL';

export interface Payment {
  id?: number;
  patientId: number;
  appointmentId?: number;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  notes?: string;
  createdAt?: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PAID: 'Payé',
  UNPAID: 'Non payé',
  PARTIAL: 'Partiel',
};
