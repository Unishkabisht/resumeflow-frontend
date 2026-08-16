import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

function passwordMatchValidator(group: AbstractControl) {
  const password = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  loading = false;
  showNewPassword = false;
  showConfirmPassword = false;

  resetForm = new FormGroup(
    {
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    },
    { validators: passwordMatchValidator }
  );

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordStrength(): { label: string; level: number; color: string } {
    const val = this.resetForm.get('newPassword')?.value || '';
    if (!val) return { label: '', level: 0, color: '' };

    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score <= 2) return { label: 'Weak', level: 1, color: '#f87171' };
    if (score <= 3) return { label: 'Medium', level: 2, color: '#fbbf24' };
    return { label: 'Strong', level: 3, color: '#10d99a' };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.loading = true;
    const newPassword = this.resetForm.get('newPassword')?.value || '';

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Password reset successfully! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Reset failed. Please try again.');
      }
    });
  }
}
