import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeDocument, ResumeFlowService, ShareRecord } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {
  user: any = { name: 'User' };
  isDarkMode = true;
  documents: ResumeDocument[] = [];
  shares: ShareRecord[] = [];
  loading = false;

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
    this.loadDocuments();
    this.loadShares();
  }

  restoreShellState(): void {
    const savedTheme = localStorage.getItem('rf_theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    try {
      const stored = localStorage.getItem('user');
      this.user = stored ? JSON.parse(stored) : this.user;
    } catch { }
  }

  loadDocuments(): void {
    this.loading = true;
    this.flow.getDocuments().subscribe({
      next: docs => {
        this.documents = docs;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Could not load documents.');
      }
    });
  }

  loadShares(): void {
    this.flow.getAllShares().subscribe({
      next: shares => {
        this.shares = shares;
      },
      error: err => this.toast.error(err.error?.message || 'Could not load share links.')
    });
  }

  createShare(doc: ResumeDocument): void {
    this.flow.createShare(doc.id).subscribe({
      next: share => {
        this.shares = [share, ...this.shares.filter(item => item.documentId !== doc.id)];
        this.toast.success('Share link created.');
      },
      error: err => this.toast.error(err.error?.message || 'Could not create share link.')
    });
  }

  getShareFor(doc: ResumeDocument): ShareRecord | undefined {
    return this.shares.find(share => share.documentId === doc.id);
  }

  copyShare(share: ShareRecord): void {
    navigator.clipboard?.writeText(share.shareUrl);
    this.toast.success('Share link copied.');
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
