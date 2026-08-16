import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

declare const require: any;
const html2pdf = require('html2pdf.js');

@Injectable({
    providedIn: 'root'
})
export class BrowserExportService {

    constructor() { }

    exportToPdf(elementId: string, filename: string = 'resume.pdf'): void {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id "${elementId}" not found for PDF export.`);
            return;
        }

        const options = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save();
    }

    exportToDocx(resume: any, filename: string = 'resume.docx'): void {
        const docSections: any[] = [];

        if (resume?.personalInfo?.fullName) {
            docSections.push(
                new Paragraph({
                    text: resume.personalInfo.fullName,
                    heading: HeadingLevel.TITLE
                })
            );
        }

        const contactText = [
            resume?.personalInfo?.jobTitle,
            resume?.personalInfo?.email,
            resume?.personalInfo?.phone
        ].filter(Boolean).join(' | ');

        if (contactText) {
            docSections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: contactText,
                            italics: true,
                            color: '555555'
                        })
                    ]
                })
            );
        }

        docSections.push(new Paragraph({ text: '' }));

        if (resume?.sections && Array.isArray(resume.sections)) {
            resume.sections.forEach((sec: any) => {
                if (sec.title) {

                    docSections.push(
                        new Paragraph({
                            text: sec.title.toUpperCase(),
                            heading: HeadingLevel.HEADING_1
                        })
                    );
                }

                if (sec.items && Array.isArray(sec.items)) {
                    sec.items.forEach((item: any) => {

                        if (item.title || item.subtitle) {
                            const itemTitleStr = [item.title, item.subtitle].filter(Boolean).join(' — ');
                            docSections.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: itemTitleStr,
                                            bold: true
                                        })
                                    ]
                                })
                            );
                        }

                        if (item.bullets && Array.isArray(item.bullets)) {
                            item.bullets.forEach((bullet: string) => {
                                if (bullet && bullet.trim()) {
                                    docSections.push(
                                        new Paragraph({
                                            text: bullet,
                                            bullet: { level: 0 }
                                        })
                                    );
                                }
                            });
                        }
                    });
                }

                docSections.push(new Paragraph({ text: '' }));
            });
        }

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: docSections
                }
            ]
        });

        Packer.toBlob(doc).then((blob: Blob) => {
            saveAs(blob, filename);
        });
    }
}
