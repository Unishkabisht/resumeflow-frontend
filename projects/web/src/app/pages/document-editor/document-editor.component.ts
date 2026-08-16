import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DocVersion, ResumeDocument, ResumeFlowService, ShareRecord } from '../../shared/services/resumeflow.service';
import { ToastService } from '../../shared/services/toast.service';
import { TemplateService } from '../../shared/services/template.service';
import { ResumeTemplate, ResumeTemplateService, TemplateConfig } from '../../shared/services/resume-template.service';
import { BrowserExportService } from '../../shared/services/browser-export.service';

type SectionZone = 'sidebar' | 'main';

interface EditableItem {
  id?: number;
  content: string;
  position: number;
  saving?: boolean;
}

interface EditableSection {
  id?: number;
  heading: string;
  position: number;
  items: EditableItem[];
  collapsed?: boolean;
  saving?: boolean;
  zone: SectionZone;
}

type EditorTab = 'editor' | 'versions' | 'sharing';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  documentId = 0;
  document?: ResumeDocument;
  title = '';
  sections: EditableSection[] = [];
  loading = false;
  savingTitle = false;
  isDarkMode = true;
  user: any = { name: 'User' };
  activeTab: EditorTab = 'editor';

  templates: ResumeTemplate[] = [];
  selectedTemplateId: number | null = null;
  templateConfig: TemplateConfig = { layout: 'simple', accent: '#FF7256' };
  templatePickerOpen = false;

  versions: DocVersion[] = [];
  versionsLoading = false;
  restoringVersionId: number | null = null;
  private versionTrigger$ = new Subject<void>();

  share: ShareRecord | null = null;
  shareLoading = false;

  exportingPdf = false;
  exportingDocx = false;

  newSectionHeading = '';
  newSectionZone: SectionZone = 'main';

  navItems = [
    { label: 'Dashboard', icon: 'grid', route: '/dashboard' },
    { label: 'Documents', icon: 'file', route: '/documents' },
    { label: 'Templates', icon: 'layout', route: '/templates' },
    { label: 'Applications', icon: 'chart', route: '/applications' },
    { label: 'Shared links', icon: 'share', route: '/shares' },
    { label: 'Exports', icon: 'export', route: '/exports' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flow: ResumeFlowService,
    private toast: ToastService,
    private templateService: TemplateService,
    private resumeTemplates: ResumeTemplateService,
    private browserExport: BrowserExportService
  ) { }

  ngOnInit(): void {
    this.restoreShellState();
    this.documentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTemplates();
    this.loadDocument();

    this.versionTrigger$
      .pipe(debounceTime(2500))
      .subscribe(() => this.snapshotVersion());
  }

  ngOnDestroy(): void {
    this.versionTrigger$.complete();
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
      next: (res) => { this.templates = res.data || []; this.applyTemplateConfig(); },
      error: () => { }
    });
  }

  loadDocument(): void {
    this.loading = true;
    this.flow.getDocument(this.documentId).subscribe({
      next: doc => {
        this.document = doc;
        this.title = doc.title;
        this.selectedTemplateId = doc.templateId ?? null;
        const rawSections = (doc.sections || [])
          .slice()
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        this.sections = rawSections.map((section: any, idx: number) =>
          this.toEditableSection(section, idx));
        this.applyTemplateConfig();
        this.loading = false;
        this.loadVersions();
        this.loadShare();
      },
      error: err => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Could not open document.');
      }
    });
  }

  private zoneStorageKey(): string {
    return `rf_section_zones_${this.documentId}`;
  }

  private loadZoneMap(): Record<number, SectionZone> {
    try {
      const raw = localStorage.getItem(this.zoneStorageKey());
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveZoneMap(): void {
    const map: Record<number, SectionZone> = {};
    this.sections.forEach(s => { if (s.id) map[s.id] = s.zone; });
    localStorage.setItem(this.zoneStorageKey(), JSON.stringify(map));
  }

  private toEditableSection(section: any, fallbackIndex: number): EditableSection {
    const items = (section.items || [])
      .slice()
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((item: any, idx: number): EditableItem => ({
        id: item.id,
        content: item.content || '',
        position: item.position ?? idx
      }));

    const zoneMap = this.loadZoneMap();
    let zone: SectionZone;
    if (section.id && zoneMap[section.id]) {
      zone = zoneMap[section.id];
    } else {
      // backward compatibility: first section defaults to sidebar, rest to main
      zone = fallbackIndex === 0 ? 'sidebar' : 'main';
    }

    return {
      id: section.id,
      heading: section.heading || 'Section',
      position: section.position ?? 0,
      items: items.length ? items : [],
      zone
    };
  }

  applyTemplateConfig(): void {
    const tpl = this.templates.find(t => t.id === this.selectedTemplateId) || null;
    this.templateConfig = this.resumeTemplates.parseConfig(tpl);
  }

  selectedTemplateName(): string {
    const tpl = this.templates.find(t => t.id === this.selectedTemplateId);
    return tpl ? tpl.name : 'Choose a template';
  }

  paperFontStack(): string {
    return this.resumeTemplates.fontStack(this.templateConfig);
  }

  get sidebarSections(): EditableSection[] {
    return this.sections.filter(s => s.zone === 'sidebar');
  }

  get mainSections(): EditableSection[] {
    return this.sections.filter(s => s.zone === 'main');
  }

  setSectionZone(section: EditableSection, zone: SectionZone): void {
    section.zone = zone;
    this.saveZoneMap();
    this.versionTrigger$.next();
  }

  saveTitle(): void {
    if (!this.title.trim()) return;
    this.savingTitle = true;
    this.flow.updateDocument(this.documentId, { title: this.title.trim() }).subscribe({
      next: doc => {
        this.document = { ...(this.document as ResumeDocument), ...doc };
        this.savingTitle = false;
        this.versionTrigger$.next();
      },
      error: err => {
        this.savingTitle = false;
        this.toast.error(err.error?.message || 'Could not save title.');
      }
    });
  }

  toggleTemplatePicker(): void {
    this.templatePickerOpen = !this.templatePickerOpen;
  }

  chooseTemplate(tpl: ResumeTemplate): void {
    this.selectedTemplateId = tpl.id;
    this.applyTemplateConfig();
    this.templatePickerOpen = false;
    this.flow.updateDocument(this.documentId, { templateId: tpl.id }).subscribe({
      next: () => {
        this.toast.success('Template applied.');
        this.versionTrigger$.next();
      },
      error: err => this.toast.error(err.error?.message || 'Could not switch template.')
    });
  }

  addSection(): void {
    const heading = this.newSectionHeading.trim() || 'Custom Section';
    const zone = this.newSectionZone;
    this.flow.createSection(this.documentId, { type: 'custom', label: heading }).subscribe({
      next: created => {
        this.sections.push({
          id: created.id,
          heading: created.heading || heading,
          position: created.position ?? this.sections.length,
          items: [],
          zone
        });
        this.saveZoneMap();
        this.newSectionHeading = '';
        this.versionTrigger$.next();
      },
      error: err => this.toast.error(err.error?.message || 'Could not add section.')
    });
  }

  saveSectionHeading(section: EditableSection): void {
    if (!section.heading.trim()) {
      this.toast.error('Section heading is required.');
      return;
    }
    if (!section.id) return;
    section.saving = true;
    this.flow.updateSection(this.documentId, section.id, { label: section.heading.trim() }).subscribe({
      next: () => {
        section.saving = false;
        this.versionTrigger$.next();
      },
      error: err => {
        section.saving = false;
        this.toast.error(err.error?.message || 'Could not save section.');
      }
    });
  }

  removeSection(section: EditableSection, index: number): void {
    if (!section.id) {
      this.sections.splice(index, 1);
      return;
    }
    this.flow.deleteSection(this.documentId, section.id).subscribe({
      next: () => {
        this.sections.splice(index, 1);
        this.saveZoneMap();
        this.toast.success('Section removed.');
        this.versionTrigger$.next();
      },
      error: err => this.toast.error(err.error?.message || 'Could not remove section.')
    });
  }

  toggleCollapse(section: EditableSection): void {
    section.collapsed = !section.collapsed;
  }

  moveSectionUp(index: number): void {
    if (index <= 0) return;
    this.swapSections(index, index - 1);
  }

  moveSectionDown(index: number): void {
    if (index >= this.sections.length - 1) return;
    this.swapSections(index, index + 1);
  }

  private swapSections(i: number, j: number): void {
    const a = this.sections[i];
    const b = this.sections[j];
    [this.sections[i], this.sections[j]] = [b, a];
    a.position = j;
    b.position = i;
    if (a.id) this.flow.updateSection(this.documentId, a.id, { order: j }).subscribe();
    if (b.id) this.flow.updateSection(this.documentId, b.id, { order: i }).subscribe();
    this.versionTrigger$.next();
  }

  addBullet(section: EditableSection): void {
    if (!section.id) {
      this.toast.info('Save the section heading first.');
      return;
    }
    this.flow.createItem(this.documentId, section.id, '').subscribe({
      next: item => {
        section.items.push({ id: item.id, content: '', position: item.position ?? section.items.length });
      },
      error: err => this.toast.error(err.error?.message || 'Could not add bullet.')
    });
  }

  saveBullet(section: EditableSection, item: EditableItem): void {
    if (!section.id || !item.id) return;
    item.saving = true;
    this.flow.updateItem(this.documentId, section.id, item.id, item.content).subscribe({
      next: () => {
        item.saving = false;
        this.versionTrigger$.next();
      },
      error: err => {
        item.saving = false;
        this.toast.error(err.error?.message || 'Could not save bullet.');
      }
    });
  }

  removeBullet(section: EditableSection, item: EditableItem, index: number): void {
    if (!section.id || !item.id) {
      section.items.splice(index, 1);
      return;
    }
    this.flow.removeItem(this.documentId, section.id, item.id).subscribe({
      next: () => {
        section.items.splice(index, 1);
        this.versionTrigger$.next();
      },
      error: err => this.toast.error(err.error?.message || 'Could not remove bullet.')
    });
  }

  moveBulletUp(section: EditableSection, index: number): void {
    if (index <= 0) return;
    this.swapBullets(section, index, index - 1);
  }

  moveBulletDown(section: EditableSection, index: number): void {
    if (index >= section.items.length - 1) return;
    this.swapBullets(section, index, index + 1);
  }

  private swapBullets(section: EditableSection, i: number, j: number): void {
    const a = section.items[i];
    const b = section.items[j];
    [section.items[i], section.items[j]] = [b, a];
    a.position = j;
    b.position = i;
    if (section.id && a.id) this.flow.updateItem(this.documentId, section.id, a.id, a.content).subscribe();
    if (section.id && b.id) this.flow.updateItem(this.documentId, section.id, b.id, b.content).subscribe();
    this.versionTrigger$.next();
  }

  loadVersions(): void {
    this.versionsLoading = true;
    this.flow.getVersions(this.documentId).subscribe({
      next: versions => { this.versions = versions; this.versionsLoading = false; },
      error: () => { this.versionsLoading = false; }
    });
  }

  private snapshotVersion(): void {
    this.flow.createVersion(this.documentId).subscribe({
      next: version => { this.versions = [version, ...this.versions]; },
      error: () => { }
    });
  }

  restoreVersion(version: DocVersion): void {
    this.restoringVersionId = version.id;
    this.flow.restoreVersion(this.documentId, version.id).subscribe({
      next: doc => {
        this.restoringVersionId = null;
        this.toast.success('Version restored.');
        this.loadDocument();
      },
      error: err => {
        this.restoringVersionId = null;
        this.toast.error(err.error?.message || 'Could not restore version.');
      }
    });
  }

  formatVersionTime(v: DocVersion): string {
    if (!v.createdAt) return '';
    const date = new Date(v.createdAt);
    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  loadShare(): void {
    this.flow.getShare(this.documentId).subscribe({
      next: share => { this.share = share; },
      error: () => { this.share = null; }
    });
  }

  createShare(): void {
    this.shareLoading = true;
    this.flow.createShare(this.documentId).subscribe({
      next: share => {
        this.share = share;
        this.shareLoading = false;
        this.toast.success('Share link created.');
      },
      error: err => {
        this.shareLoading = false;
        this.toast.error(err.error?.message || 'Could not create share link.');
      }
    });
  }

  revokeShare(): void {
    this.shareLoading = true;
    this.flow.deleteShare(this.documentId).subscribe({
      next: () => {
        this.share = null;
        this.shareLoading = false;
        this.toast.info('Share link revoked.');
      },
      error: err => {
        this.shareLoading = false;
        this.toast.error(err.error?.message || 'Could not revoke share link.');
      }
    });
  }

  copyShare(): void {
    if (!this.share) return;
    navigator.clipboard?.writeText(this.share.shareUrl);
    this.toast.success('Share link copied.');
  }

  exportPdf(): void {
    this.exportingPdf = true;
    const filename = `${(this.title || 'resume').replace(/[^a-z0-9-_ ]/gi, '').trim() || 'resume'}.pdf`;
    setTimeout(() => {
      this.browserExport.exportToPdf('resume-paper', filename);
      this.exportingPdf = false;
      this.logExport('pdf');
    }, 50);
  }

  exportDocx(): void {
    this.exportingDocx = true;
    const filename = `${(this.title || 'resume').replace(/[^a-z0-9-_ ]/gi, '').trim() || 'resume'}.docx`;
    const payload = {
      personalInfo: { fullName: this.title },
      sections: this.sections.map(s => ({
        title: s.heading,
        items: [{ bullets: s.items.map(i => i.content).filter(Boolean) }]
      }))
    };
    this.browserExport.exportToDocx(payload, filename);
    this.exportingDocx = false;
    this.logExport('docx');
  }

  private logExport(format: 'pdf' | 'docx'): void {
    this.flow.createExport(this.documentId, format).subscribe({ error: () => { } });
  }

  setTab(tab: EditorTab): void {
    this.activeTab = tab;
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