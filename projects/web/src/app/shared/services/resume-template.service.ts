import { Injectable } from '@angular/core';

export interface TemplateConfig {
    layout: 'simple' | 'sidebar';
    accent: string;
    font?: string;
    density?: 'comfortable' | 'compact';
    showPhoto?: boolean;
}

export interface ResumeTemplate {
    id: number;
    name: string;
    config: string | TemplateConfig;
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
    layout: 'simple',
    accent: '#FF7256'
};

@Injectable({ providedIn: 'root' })
export class ResumeTemplateService {

    parseConfig(template: ResumeTemplate | null | undefined): TemplateConfig {
        if (!template || !template.config) {
            return { ...DEFAULT_TEMPLATE_CONFIG };
        }
        if (typeof template.config === 'object') {
            return { ...DEFAULT_TEMPLATE_CONFIG, ...template.config };
        }
        try {
            const parsed = JSON.parse(template.config);
            return { ...DEFAULT_TEMPLATE_CONFIG, ...parsed };
        } catch {
            return { ...DEFAULT_TEMPLATE_CONFIG };
        }
    }

    fontStack(config: TemplateConfig): string {
        const font = (config.font || '').toLowerCase();
        if (font.includes('mono')) return "'Roboto Mono', 'Courier New', monospace";
        if (font.includes('roboto')) return "'Roboto', 'Helvetica Neue', Arial, sans-serif";
        if (font.includes('arial')) return "Arial, Helvetica, sans-serif";
        if (font.includes('georgia')) return "Georgia, 'Times New Roman', serif";
        return "Georgia, 'Times New Roman', serif";
    }
}