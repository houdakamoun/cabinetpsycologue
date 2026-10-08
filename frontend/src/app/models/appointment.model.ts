export const PALETTE = {
  primary: '#099078',
  accent: '#FFD6D1',
  cream: '#F9ECE5',
  primaryDark: '#067a65',
} as const;

export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id?: number;
  patientId: number;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  color?: string;
  price?: number;
  patient?: {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  CONFIRMED: 'Confirmé',
  PENDING: 'En attente',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  CONFIRMED: PALETTE.primary,
  PENDING: PALETTE.accent,
  CANCELLED: '#c5d5d0',
  COMPLETED: PALETTE.primaryDark,
};

export const APPOINTMENT_STATUS_TEXT_COLORS: Record<AppointmentStatus, string> = {
  CONFIRMED: '#ffffff',
  PENDING: PALETTE.primary,
  CANCELLED: '#5c736d',
  COMPLETED: '#ffffff',
};
