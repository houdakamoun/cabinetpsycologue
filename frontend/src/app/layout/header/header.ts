import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service.ts';

@Component({
  selector: 'app-header',
  imports: [DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  userName = 'Psychologue';
  userEmail = '';
  userInitials = 'CP';
  today = new Date();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user?.email) {
      this.userEmail = user.email;
      this.userName = user.firstName || user.email.split('@')[0];
      const parts = this.userName.split(/\s+/).filter(Boolean);
      this.userInitials =
        parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : this.userName.slice(0, 2).toUpperCase();
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
