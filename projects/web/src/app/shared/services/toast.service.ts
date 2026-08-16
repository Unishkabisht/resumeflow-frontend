import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  removing?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  success(message: string): void {
    this.addToast('success', message);
  }

  error(message: string): void {
    this.addToast('error', message);
  }

  info(message: string): void {
    this.addToast('info', message);
  }

  remove(id: number): void {
    const toasts = this.toastsSubject.value.map(t =>
      t.id === id ? { ...t, removing: true } : t
    );
    this.toastsSubject.next(toasts);

    setTimeout(() => {
      this.toastsSubject.next(
        this.toastsSubject.value.filter(t => t.id !== id)
      );
    }, 300);
  }

  private addToast(type: Toast['type'], message: string): void {
    const id = ++this.counter;
    const toast: Toast = { id, type, message };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => this.remove(id), 4000);
  }
}
