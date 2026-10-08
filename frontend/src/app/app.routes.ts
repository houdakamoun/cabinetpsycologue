import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guard/auth.guard';
import { LayoutComponent } from './layout/layout.component/layout.component';
import { Dashboard } from './layout/dashboard/dashboard';
import { Login } from './modules/auth/login/login';
import { Register } from './modules/auth/register/register';
import { Home } from './public/home/home';
import { ProfilePsy } from './public/profile-psy/profile-psy';
import { Booking } from './public/booking/booking';
import { PatientList } from './modules/patients/patient-list/patient-list';
import { PatientForm } from './modules/patients/patient-form/patient-form';
import { PatientDetails } from './modules/patients/patient-details/patient-details';
import { AppointmentList } from './modules/appointments/appointment-list/appointment-list';
import { AppointmentForm } from './modules/appointments/appointment-form/appointment-form';
import { CalendarView } from './modules/appointments/calender/calendar-view';
import { PaymentList } from './modules/payments/payment-list/payment-list';
import { PatientSignup } from './public/patient-signup/patient-signup';
import { QrSignup } from './modules/patients/qr-signup/qr-signup';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component: Home },
  { path: 'a-propos', component: ProfilePsy },
  { path: 'contact', component: Booking },
  { path: 'inscription', component: PatientSignup },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'patients', component: PatientList },
      { path: 'patients/qr-inscription', component: QrSignup },
      { path: 'patients/nouveau', component: PatientForm },
      { path: 'patients/:id', component: PatientDetails },
      { path: 'patients/:id/modifier', component: PatientForm },
      { path: 'rendez-vous', component: AppointmentList },
      { path: 'rendez-vous/nouveau', component: AppointmentForm },
      { path: 'rendez-vous/:id/modifier', component: AppointmentForm },
      { path: 'calendrier', component: CalendarView },
      { path: 'paiements', component: PaymentList },
    ],
  },
  { path: '**', redirectTo: 'accueil' },
];
