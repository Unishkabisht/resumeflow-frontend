import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

function passwordMatch(group: AbstractControl) {
  const password = group.get("password")?.value;
  const confirm = group.get("confirmPassword")?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  showPassword = false;
  showConfirmPassword = false;
  errorMsg = '';

  signupForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required)
    },
    { validators: passwordMatch }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    const { name, email, password } = this.signupForm.value;

    this.authService.signUp({ name, email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.toast.success('Account created! Welcome aboard!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Signup failed';
        this.toast.error(this.errorMsg);
      }
    });
  }
}
