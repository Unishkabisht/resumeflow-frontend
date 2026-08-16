import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStatus, JobApplication, ResumeDocument, ResumeFlowService } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  user: any = { name: 'User' };
  isDarkMode = true;
  loading = false;
  applications: JobApplication[] = [];
  documents: ResumeDocument[] = [];
  formOpen = false;
  editingId: number | null = null;
  form = {
    company: '',
    role: '',
    status: 'saved' as ApplicationStatus,
    documentId: null as number | null
  };

  statuses: ApplicationStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected'];

  navItems = [
    { label: 'Dashboard', icon: 'grid', route: '/dashboard' },
    { label: 'Documents', icon: 'file', route: '/documents' },
    { label: 'Templates', icon: 'layout', route: '/templates' },
    { label: 'Applications', icon: 'chart', route: '/applications' },
    { label: 'Shared links', icon: 'share', route: '/shares' },
    { label: 'Exports', icon: 'export', route: '/exports' }
  ];

  constructor(
    private flow: ResumeFlowService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.restoreShellState();
    this.loadData();
  }

  restoreShellState(): void {
    const savedTheme = localStorage.getItem('rf_theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    try {
      const stored = localStorage.getItem('user');
      this.user = stored ? JSON.parse(stored) : this.user;
    } catch { }
  }

  loadData(): void {
    this.loading = true;
    this.flow.getDocuments().subscribe({
      next: docs => {
        this.documents = docs;
        this.flow.getApplications().subscribe({
          next: apps => {
            this.applications = apps;
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.toast.error(err.error?.message || 'Could not load applications.');
          }
        });
      },
      error: err => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Could not load documents.');
      }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form = { company: '', role: '', status: 'saved', documentId: null };
    this.formOpen = true;
  }

  editApplication(app: JobApplication): void {
    this.editingId = app.id;
    this.form = {
      company: app.company,
      role: app.role,
      status: app.status || 'saved',
      documentId: app.documentId || null
    };
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
  }

  saveApplication(): void {
    const company = this.form.company.trim();
    const role = this.form.role.trim();
    if (!company || !role) {
      this.toast.error('Company and role are required.');
      return;
    }

    const payload = {
      company,
      role,
      status: this.form.status,
      documentId: this.form.documentId
    };

    const request = this.editingId
      ? this.flow.updateApplication(this.editingId, payload)
      : this.flow.createApplication(payload);

    request.subscribe({
      next: saved => {
        if (this.editingId) {
          this.applications = this.applications.map(app => app.id === saved.id ? saved : app);
        } else {
          this.applications = [saved, ...this.applications];
        }
        this.closeForm();
        this.toast.success(this.editingId ? 'Application updated.' : 'Application added.');
      },
      error: err => this.toast.error(err.error?.message || 'Could not save application.')
    });
  }

  deleteApplication(app: JobApplication): void {
    this.flow.deleteApplication(app.id).subscribe({
      next: () => {
        this.applications = this.applications.filter(item => item.id !== app.id);
        this.toast.success('Application deleted.');
      },
      error: err => this.toast.error(err.error?.message || 'Could not delete application.')
    });
  }

  getDocumentTitle(app: JobApplication): string {
    return app.Document?.title || this.documents.find(doc => doc.id === app.documentId)?.title || 'No document';
  }

  statusLabel(status: string | null): string {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Saved';
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
