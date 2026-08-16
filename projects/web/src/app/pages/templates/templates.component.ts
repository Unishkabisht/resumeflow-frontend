import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeDocument, ResumeFlowService } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';
import { TemplateService } from '../../shared/services/template.service';
import { ResumeTemplate, ResumeTemplateService, TemplateConfig } from '../../shared/services/resume-template.service';

@Component({
  selector: 'app-templates-page',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesPageComponent implements OnInit {
  user: any = { name: 'User' };
  isDarkMode = true;
  documents: ResumeDocument[] = [];
  creatingKey: number | string = '';

  templates: ResumeTemplate[] | null = null;

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
    private templateService: TemplateService,
    private resumeTemplates: ResumeTemplateService
  ) { }

  configOf(template: ResumeTemplate): TemplateConfig {
    return this.resumeTemplates.parseConfig(template);
  }

  fontStackOf(template: ResumeTemplate): string {
    return this.resumeTemplates.fontStack(this.configOf(template));
  }

  ngOnInit(): void {
    this.restoreShellState();
    this.loadTemplates();
  }

  restoreShellState(): void {
    const savedTheme = localStorage.getItem('rf_theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    try {
      const stored = localStorage.getItem('user');
      this.user = stored ? JSON.parse(stored) : this.user;
    } catch { }
  }

  loadTemplates(): void {
    this.templateService.list().subscribe({
      next: (res) => { this.templates = res.data || []; },
      error: (err) => {
        this.templates = [];
        this.toast.error(err.error?.message || 'Could not load templates.');
      }
    });
  }

  useTemplate(template: ResumeTemplate): void {
    this.creatingKey = template.id;
    const title = `Untitled — ${template.name}`;
    this.flow.createDocument({ title, type: 'resume', templateId: template.id }).subscribe({
      next: doc => {
        this.creatingKey = '';
        this.toast.success('Resume created from template.');
        this.router.navigate(['/documents', doc.id, 'edit']);
      },
      error: err => {
        this.creatingKey = '';
        this.toast.error(err.error?.message || 'Could not create resume.');
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
