import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  submitted = false;
  loading = false;

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private authService: AuthService,
    private toast: ToastService
  ) {}

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.authService.forgotPassword(this.forgotForm.value.email!).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Something went wrong. Please try again.');
      }
    });
  }
}
