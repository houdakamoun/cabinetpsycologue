import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-booking',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {
  form = { name: '', email: '', phone: '', message: '' };
  sent = false;

  submit(): void {
    this.sent = true;
  }
}
