import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeDocument, ResumeFlowService } from '../../shared/services/resumeflow.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  user: any = { name: 'User' };
  isDarkMode = true;
  loading = false;
  documents: ResumeDocument[] = [];
  selectedType: 'all' | 'resume' | 'cover_letter' = 'all';
  searchTerm = '';
  createModalOpen = false;
  newTitle = '';
  newType: 'resume' | 'cover_letter' = 'resume';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.restoreShellState();
    this.loadDocuments();
  }

  get filteredDocuments(): ResumeDocument[] {
    let list = this.selectedType === 'all'
      ? this.documents
      : this.documents.filter(doc => doc.type === this.selectedType);

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(doc => (doc.title || '').toLowerCase().includes(term));
    }
    return list;
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
      error: () => {
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  openCreateModal(): void {
    this.newTitle = '';
    this.newType = 'resume';
    this.createModalOpen = true;
  }

  closeCreateModal(): void {
    this.createModalOpen = false;
  }

  createDocument(): void {
    const title = this.newTitle.trim();
    if (!title) {
      return;
    }

    this.flow.createDocument({ title, type: this.newType }).subscribe({
      next: doc => {
        this.documents = [doc, ...this.documents];
        this.closeCreateModal();
        this.router.navigate(['/documents', doc.id, 'edit']);
      }
    });
  }

  duplicateDocument(doc: ResumeDocument): void {
    this.flow.duplicateDocument(doc.id).subscribe({
      next: copy => {
        this.documents = [copy, ...this.documents];
      }
    });
  }

  editDocument(doc: ResumeDocument): void {
    this.router.navigate(['/documents', doc.id, 'edit']);
  }

  deleteDocument(doc: ResumeDocument): void {
    this.flow.deleteDocument(doc.id).subscribe({
      next: () => {
        this.documents = this.documents.filter(item => item.id !== doc.id);
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
    this.router.navigate(['/login']);
  }

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleDateString() : 'Not updated';
  }
}