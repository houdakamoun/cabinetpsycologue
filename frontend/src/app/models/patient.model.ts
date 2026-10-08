export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  birthDate?: string;
  age?: number;
  address?: string;
  notes?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}
