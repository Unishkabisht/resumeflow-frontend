import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

type ProfileTab = 'details' | 'password';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = { name: 'User' };
  isDarkMode = true;
  activeTab: ProfileTab = 'details';

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  savingProfile = false;
  savingPassword = false;

  navItems = [
    { label: 'Dashboard', icon: 'grid', route: '/dashboard' },
    { label: 'Documents', icon: 'file', route: '/documents' },
    { label: 'Templates', icon: 'layout', route: '/templates' },
    { label: 'Applications', icon: 'chart', route: '/applications' },
    { label: 'Shared links', icon: 'share', route: '/shares' },
    { label: 'Exports', icon: 'export', route: '/exports' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.restoreShellState();

    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.loadUserProfile();
  }

  restoreShellState(): void {
    const savedTheme = localStorage.getItem('rf_theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    try {
      const stored = localStorage.getItem('user');
      this.user = stored ? JSON.parse(stored) : this.user;
    } catch { }
  }

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          fullName: user.fullName || user.name || '',
          email: user.email || ''
        });
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Could not load profile.');
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (updated) => {
        this.savingProfile = false;
        this.toast.success('Profile updated.');

        const merged = { ...this.user, name: this.profileForm.value.fullName, email: this.profileForm.value.email };
        this.user = merged;
        localStorage.setItem('user', JSON.stringify(merged));
      },
      error: (err) => {
        this.savingProfile = false;
        this.toast.error(err.error?.message || 'Profile update failed.');
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.toast.error('New passwords do not match.');
      return;
    }
    this.savingPassword = true;
    this.authService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.savingPassword = false;
        this.toast.success('Password changed.');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.savingPassword = false;
        this.toast.error(err.error?.message || 'Password update failed.');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('rf_theme', this.isDarkMode ? 'dark' : 'light');
  }

  getUserInitial(): string {
    return (this.user?.name || 'U').charAt(0).toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.toast.info('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
