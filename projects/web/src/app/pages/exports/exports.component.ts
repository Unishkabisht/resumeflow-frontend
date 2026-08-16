import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportRecord, ResumeDocument, ResumeFlowService } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss']
})
export class ExportsComponent implements OnInit {
  user: any = { name: 'User' };
  isDarkMode = true;
  loading = false;
  exporting = false;
  exports: ExportRecord[] = [];
  documents: ResumeDocument[] = [];
  selectedDocumentId: number | null = null;
  selectedFormat: 'pdf' = 'pdf';
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
        this.selectedDocumentId = docs[0]?.id || null;
        this.flow.getExports().subscribe({
          next: records => {
            this.exports = records;
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.toast.error(err.error?.message || 'Could not load exports.');
          }
        });
      },
      error: err => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Could not load documents.');
      }
    });
  }

  createExport(): void {
    if (!this.selectedDocumentId) {
      this.toast.error('Create a document before exporting.');
      return;
    }

    this.exporting = true;
    this.flow.createExport(
      Number(this.selectedDocumentId)
    ).subscribe({
      next: record => {
        this.exports = [record, ...this.exports];
        this.exporting = false;
        this.toast.success('Export record created.');
      },
      error: err => {
        this.exporting = false;
        this.toast.error(err.error?.message || 'Could not create export.');
      }
    });
  }

  getDocumentTitle(record: ExportRecord): string {
    return record.Document?.title || this.documents.find(doc => doc.id === record.documentId)?.title || `Document #${record.documentId}`;
  }

  getAbsoluteUrl(record: ExportRecord): string {
    if (!record?.fileUrl) return '#';
    return record.fileUrl;
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

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleString() : 'Just now';
  }
}
