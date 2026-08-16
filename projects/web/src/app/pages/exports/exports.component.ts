import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportRecord, ResumeDocument, ResumeFlowService } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';
import { BrowserExportService } from '../../shared/services/browser-export.service';

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
  selectedFormat: 'pdf' | 'docx' = 'pdf';
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
    private toast: ToastService,
    private browserExport: BrowserExportService
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

    // Fetch the full document (with sections + items) so we can actually build the file
    this.flow.getDocument(this.selectedDocumentId).subscribe({
      next: doc => {
        const sections = (doc.sections || [])
          .slice()
          .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));

        const filename = `${(doc.title || 'resume').replace(/[^a-z0-9-_ ]/gi, '').trim() || 'resume'}.${this.selectedFormat}`;

        if (this.selectedFormat === 'docx') {
          const payload = {
            personalInfo: { fullName: doc.title },
            sections: sections.map((s: any) => ({
              title: s.heading,
              items: [{
                bullets: (s.items || [])
                  .slice()
                  .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
                  .map((i: any) => i.content)
                  .filter(Boolean)
              }]
            }))
          };
          this.browserExport.exportToDocx(payload, filename);
          this.finishExportRecord(filename);
        } else {
          // PDF export needs a rendered element on screen; build a hidden one from the document data.
          this.exportPdfFromData(doc, sections, filename);
        }
      },
      error: err => {
        this.exporting = false;
        this.toast.error(err.error?.message || 'Could not load document for export.');
      }
    });
  }

  private exportPdfFromData(doc: ResumeDocument, sections: any[], filename: string): void {
    const container = window.document.createElement('div');
    container.id = 'rf-hidden-export-paper';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.background = '#ffffff';
    container.style.color = '#111111';
    container.style.padding = '32px';
    container.style.fontFamily = 'Arial, sans-serif';

    const nameEl = window.document.createElement('h2');
    nameEl.textContent = doc.title || 'Untitled Resume';
    container.appendChild(nameEl);

    sections.forEach((section: any) => {
      const heading = window.document.createElement('h3');
      heading.textContent = section.heading || 'Section';
      container.appendChild(heading);

      const list = window.document.createElement('ul');
      const items = (section.items || [])
        .slice()
        .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));

      if (!items.length) {
        const li = window.document.createElement('li');
        li.textContent = '—';
        list.appendChild(li);
      } else {
        items.forEach((item: any) => {
          const li = window.document.createElement('li');
          li.textContent = item.content || '—';
          list.appendChild(li);
        });
      }
      container.appendChild(list);
    });

    window.document.body.appendChild(container);

    setTimeout(() => {
      this.browserExport.exportToPdf('rf-hidden-export-paper', filename);
      window.document.body.removeChild(container);
      this.finishExportRecord(filename);
    }, 50);
  }

  private finishExportRecord(filename: string): void {
    if (!this.selectedDocumentId) {
      this.exporting = false;
      return;
    }
    this.flow.createExport(this.selectedDocumentId).subscribe({
      next: record => {
        this.exports = [record, ...this.exports];
        this.exporting = false;
        this.toast.success(`${filename} downloaded.`);
      },
      error: err => {
        this.exporting = false;
        this.toast.error(err.error?.message || 'File downloaded, but the export record could not be saved.');
      }
    });
  }

  getDocumentTitle(record: ExportRecord): string {
    return record.Document?.title || this.documents.find(doc => doc.id === record.documentId)?.title || `Document #${record.documentId}`;
  }

  getAbsoluteUrl(record: ExportRecord): string {
    if (!record?.documentId) return '#';
    return `/documents/${record.documentId}/edit`;
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