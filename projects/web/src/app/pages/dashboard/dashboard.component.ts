import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResumeDocument, ResumeFlowService } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';

interface StatCard {
  label: string;
  value: string;
  icon: string;
}

interface PipelineRow {
  label: string;
  status: string;
  count: number;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any = { name: 'User', email: '' };
  isDarkMode = true;
  loading = false;

  documents: ResumeDocument[] = [];
  recentDocuments: ResumeDocument[] = [];

  stats: StatCard[] = [
    { label: 'Documents', value: '0', icon: 'description' },
    { label: 'Applications', value: '0', icon: 'work_outline' },
    { label: 'Saved versions', value: '0', icon: 'history' },
    { label: 'Exports', value: '0', icon: 'file_download' }
  ];

  pipeline: PipelineRow[] = [
    { label: 'Saved', status: 'saved', count: 0, colorClass: 'dot-saved' },
    { label: 'Applied', status: 'applied', count: 0, colorClass: 'dot-applied' },
    { label: 'Interview', status: 'interview', count: 0, colorClass: 'dot-interview' },
    { label: 'Offer', status: 'offer', count: 0, colorClass: 'dot-offer' },
    { label: 'Rejected', status: 'rejected', count: 0, colorClass: 'dot-rejected' }
  ];

  navItems = [
    { label: 'Dashboard', icon: 'grid', route: '/dashboard' },
    { label: 'Documents', icon: 'file', route: '/documents' },
    { label: 'Templates', icon: 'layout', route: '/templates' },
    { label: 'Applications', icon: 'chart', route: '/applications' },
    { label: 'Shared links', icon: 'share', route: '/shares' },
    { label: 'Exports', icon: 'export', route: '/exports' }
  ];

  constructor(
    private router: Router,
    private toast: ToastService,
    private flow: ResumeFlowService
  ) { }

  ngOnInit(): void {
    this.restoreShellState();
    this.loadDashboard();
  }

  restoreShellState(): void {
    const savedTheme = localStorage.getItem('rf_theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    }
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    } catch { }
  }

  loadDashboard(): void {
    this.loading = true;

    forkJoin({
      documents: this.flow.getDocuments().pipe(catchError(() => of([]))),
      applications: this.flow.getApplications().pipe(catchError(() => of([]))),
      exports: this.flow.getExports().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ documents, applications, exports }) => {
        this.documents = documents;
        this.recentDocuments = documents
          .slice()
          .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
          .slice(0, 4);

        this.setStat('Documents', documents.length);
        this.setStat('Applications', applications.length);
        this.setStat('Exports', exports.length);

        this.pipeline = this.pipeline.map(row => ({
          ...row,
          count: applications.filter(app => (app.status || 'saved') === row.status).length
        }));

        this.loadVersionCounts(documents);
      },
      error: err => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Could not load dashboard.');
      }
    });
  }

  private loadVersionCounts(documents: ResumeDocument[]): void {
    if (!documents.length) {
      this.setStat('Saved versions', 0);
      this.loading = false;
      return;
    }

    const calls = documents.map(doc =>
      this.flow.getVersions(doc.id).pipe(catchError(() => of([])))
    );

    forkJoin(calls).subscribe({
      next: results => {
        const total = results.reduce((sum, versions) => sum + versions.length, 0);
        this.setStat('Saved versions', total);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private setStat(label: string, value: number): void {
    this.stats = this.stats.map(stat => stat.label === label ? { ...stat, value: String(value) } : stat);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('rf_theme', this.isDarkMode ? 'dark' : 'light');
  }

  getUserInitial(): string {
    return (this.user?.name || 'U').charAt(0).toUpperCase();
  }

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  }

  documentTypeLabel(doc: ResumeDocument): string {
    return doc.type === 'cover_letter' ? 'Cover letter' : 'Resume';
  }

  newResume(): void {
    this.router.navigate(['/documents']);
  }

  trackApplication(): void {
    this.router.navigate(['/applications']);
  }

  openDocument(doc: ResumeDocument): void {
    this.router.navigate(['/documents', doc.id, 'edit']);
  }

  viewAllDocuments(): void {
    this.router.navigate(['/documents']);
  }

  managePipeline(): void {
    this.router.navigate(['/applications']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.toast.info('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
