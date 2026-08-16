import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ResumeDocument {
  id: number;
  title: string;
  type: 'resume' | 'cover_letter';
  templateId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  sections?: any[];
}

export interface DocVersion {
  id: number;
  label: string;
  snapshot: string;
  documentId: number;
  createdAt?: string;
}

export interface ExportRecord {
  id: number;
  format: 'pdf' | 'docx';
  fileUrl?: string | null;
  documentId: number;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  Document?: Pick<ResumeDocument, 'id' | 'title' | 'type'>;
}

export interface ShareRecord {
  id: number;
  slug: string;
  documentId: number;
  shareUrl: string;
  document?: Pick<ResumeDocument, 'id' | 'title' | 'type'>;
  createdAt?: string;
}

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus | null;
  documentId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  Document?: Pick<ResumeDocument, 'id' | 'title'>;
}

@Injectable({ providedIn: 'root' })
export class ResumeFlowService {
  private api = environment.apiUrl + '/api';

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<ResumeDocument[]> {
    return this.http.get<ApiResponse<ResumeDocument[]>>(`${this.api}/documents`).pipe(map(res => res.data || []));
  }

  getDocument(id: number): Observable<ResumeDocument> {
    return this.http.get<ApiResponse<ResumeDocument>>(`${this.api}/documents/${id}`).pipe(map(res => res.data));
  }

  createDocument(payload: { title: string; type: 'resume' | 'cover_letter'; templateId?: number | null }): Observable<ResumeDocument> {
    return this.http.post<ApiResponse<ResumeDocument>>(`${this.api}/documents`, payload).pipe(map(res => res.data));
  }

  updateDocument(id: number, payload: Partial<ResumeDocument>): Observable<ResumeDocument> {
    return this.http.put<ApiResponse<ResumeDocument>>(`${this.api}/documents/${id}`, payload).pipe(map(res => res.data));
  }

  duplicateDocument(id: number): Observable<ResumeDocument> {
    return this.http.post<ApiResponse<ResumeDocument>>(`${this.api}/documents/${id}/duplicate`, {}).pipe(map(res => res.data));
  }

  deleteDocument(id: number): Observable<{}> {
    return this.http.delete<ApiResponse<{}>>(`${this.api}/documents/${id}`).pipe(map(res => res.data));
  }

  createSection(documentId: number, payload: { type: string; label: string }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.api}/documents/${documentId}/sections`, payload).pipe(map(res => res.data));
  }

  updateSection(documentId: number, sectionId: number, payload: { label?: string; order?: number }): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.api}/documents/${documentId}/sections/${sectionId}`, payload).pipe(map(res => res.data));
  }

  deleteSection(documentId: number, sectionId: number): Observable<{}> {
    return this.http.delete<ApiResponse<{}>>(`${this.api}/documents/${documentId}/sections/${sectionId}`).pipe(map(res => res.data));
  }

  createItem(documentId: number, sectionId: number, content: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.api}/documents/${documentId}/sections/${sectionId}/items`, { content }).pipe(map(res => res.data));
  }

  updateItem(documentId: number, sectionId: number, itemId: number, content: string): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.api}/documents/${documentId}/sections/${sectionId}/items/${itemId}`, { content }).pipe(map(res => res.data));
  }

  removeItem(documentId: number, sectionId: number, itemId: number): Observable<{}> {
    return this.http.delete<ApiResponse<{}>>(`${this.api}/documents/${documentId}/sections/${sectionId}/items/${itemId}`).pipe(map(res => res.data));
  }

  getVersions(documentId: number): Observable<DocVersion[]> {
    return this.http.get<ApiResponse<DocVersion[]>>(`${this.api}/documents/${documentId}/versions`).pipe(map(res => res.data || []));
  }

  createVersion(documentId: number, label?: string): Observable<DocVersion> {
    return this.http.post<ApiResponse<DocVersion>>(`${this.api}/documents/${documentId}/versions`, label ? { label } : {}).pipe(map(res => res.data));
  }

  deleteVersion(documentId: number, versionId: number): Observable<{}> {
    return this.http.delete<ApiResponse<{}>>(`${this.api}/documents/${documentId}/versions/${versionId}`).pipe(map(res => res.data));
  }

  restoreVersion(documentId: number, versionId: number): Observable<ResumeDocument> {
    return this.http.post<ApiResponse<ResumeDocument>>(`${this.api}/documents/${documentId}/versions/${versionId}/restore`, {}).pipe(map(res => res.data));
  }

  getExports(): Observable<ExportRecord[]> {
    return this.http.get<ApiResponse<ExportRecord[]>>(`${this.api}/exports`).pipe(map(res => res.data || []));
  }

  createExport(
    documentId: number,
    format: 'pdf' | 'docx' = 'pdf'
  ): Observable<ExportRecord> {

    return this.http
      .post<ApiResponse<ExportRecord>>(
        `${this.api}/documents/${documentId}/export`,
        {
          format
        }
      )
      .pipe(
        map(res => res.data)
      );
  }

  createShare(documentId: number): Observable<ShareRecord> {
    return this.http.post<ApiResponse<ShareRecord>>(`${this.api}/documents/${documentId}/share`, {}).pipe(map(res => res.data));
  }

  getAllShares(): Observable<ShareRecord[]> {
    return this.http.get<ApiResponse<ShareRecord[]>>(`${this.api}/share`).pipe(map(res => res.data || []));
  }

  getShare(documentId: number): Observable<ShareRecord> {
    return this.http.get<ApiResponse<ShareRecord>>(`${this.api}/documents/${documentId}/share`).pipe(map(res => res.data));
  }

  deleteShare(documentId: number): Observable<{}> {
    return this.http.delete<ApiResponse<{}>>(`${this.api}/documents/${documentId}/share`).pipe(map(res => res.data));
  }

  getApplications(): Observable<JobApplication[]> {
    return this.http.get<ApiResponse<JobApplication[]>>(`${this.api}/applications`).pipe(map(res => res.data || []));
  }

  createApplication(payload: Partial<JobApplication>): Observable<JobApplication> {
    return this.http.post<ApiResponse<JobApplication>>(`${this.api}/applications`, payload).pipe(map(res => res.data));
  }

  updateApplication(id: number, payload: Partial<JobApplication>): Observable<JobApplication> {
    return this.http.put<ApiResponse<JobApplication>>(`${this.api}/applications/${id}`, payload).pipe(map(res => res.data));
  }

  deleteApplication(id: number): Observable<{}> {
    return this.http.delete<ApiResponse<{}>>(`${this.api}/applications/${id}`).pipe(map(res => res.data));
  }
}
