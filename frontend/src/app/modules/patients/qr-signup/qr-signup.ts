import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-signup',
  imports: [RouterLink],
  templateUrl: './qr-signup.html',
  styleUrl: './qr-signup.css',
})
export class QrSignup implements OnInit {
  signupUrl = '';
  qrDataUrl = '';
  copied = false;

  ngOnInit(): void {
    this.signupUrl = `${window.location.origin}/inscription`;
    QRCode.toDataURL(this.signupUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#099078', light: '#ffffff' },
    }).then((url) => {
      this.qrDataUrl = url;
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.signupUrl).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  downloadQr(): void {
    const link = document.createElement('a');
    link.download = 'qr-inscription-patient.png';
    link.href = this.qrDataUrl;
    link.click();
  }
}
