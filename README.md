# ResumeFlow 🚀

<div align="center">

![ResumeFlow Banner](https://img.shields.io/badge/ResumeFlow-Professional%20Resume%20Builder-6366f1?style=for-the-badge&logo=angular&logoColor=white)

[![Angular](https://img.shields.io/badge/Angular-13.3-dd0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular Material](https://img.shields.io/badge/Angular_Material-13.3-ff4081?style=flat-square&logo=angular&logoColor=white)](https://material.angular.io/)
[![SCSS](https://img.shields.io/badge/Styles-SCSS-c69?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**A modern, intuitive, full-featured web application to design, manage, version, and export professional resumes effortlessly.**

[Explore Features](#-key-features) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Available Scripts](#-available-scripts)

</div>

---

## ✨ Overview

**ResumeFlow** is a dynamic resume-crafting suite built with Angular. Designed for professionals and job seekers, ResumeFlow enables real-time document editing, multi-template switching, version management, job application tracking, and high-fidelity client-side PDF/DOCX downloads with zero data loss.

---

## 🌟 Key Features

### 📄 Real-Time Document Editor
- **Interactive Live Preview**: Instant visual feedback as you type content, customize typography, reorder sections, and adjust spacing.
- **Section Management**: Add, remove, and reorganize standard and custom sections (Experience, Education, Skills, Projects, Certifications, etc.).
- **Dynamic Content Formatting**: Rich text and bullet-point itemization built for clean readability and formatting.

### 🎨 Diverse Professional Templates
- Switch between multiple expertly designed resume presets:
  - **Modern Split**: Contemporary dual-column layout with visual accents.
  - **Minimal Clean**: Streamlined, elegant, high-signal typography.
  - **Technical / Engineering**: Optimized for technical competencies and project highlights.
  - **Executive**: Structured for leadership roles and enterprise portfolios.
  - **Creative**: Balanced color palettes and bold headline styling.

### 📥 Client-Side Multi-Format Export
- **One-Click PDF Export**: High-resolution browser-side PDF generation powered by `html2pdf.js`.
- **DOCX Generation**: Native Microsoft Word (`.docx`) file generation utilizing `docx` and `file-saver`.
- **Export History**: Keep a digital log of all your exported files.

### 🕒 Version Control & Snapshots
- Create custom document snapshots and restore previous iterations at any time.
- Compare revisions to tailor specific variations for different job postings.

### 🔐 Authentication & Security
- Complete authentication suite: Sign Up, Login, Forgot Password, and Password Reset.
- JWT Interceptor with automatic token management.
- Protected routes using Angular route guards (`AuthGuard` & `NoAuthGuard`).

### 🌓 Premium Glassmorphism UI & Dark Mode
- Polished modern UI with glassmorphism effects, smooth micro-interactions, responsive navigation, and seamless light/dark theme switching.

---

## 🛠️ Tech Stack

- **Framework**: [Angular 13](https://angular.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Angular Material 13](https://material.angular.io/)
- **Styles**: SCSS (Custom Design System, CSS Variables, Glassmorphism)
- **Document Generation**:
  - `html2pdf.js` — Client-side HTML-to-PDF rendering
  - `docx` — Native `.docx` binary generation
  - `file-saver` — File streaming & download triggers
- **State & Networking**: RxJS, Angular HttpClient with Auth Interceptors
- **Icons & Typography**: Google Fonts (*Manrope, Sora, Space Grotesk, Roboto*), Material Icons

---

## 📁 Project Structure

```text
resumeflow-frontend/
├── projects/
│   └── web/
│       ├── guards/                  # Route protection guards (Auth & NoAuth)
│       └── src/
│           ├── app/
│           │   ├── components/      # Reusable landing page components (Hero, Features, Stats, etc.)
│           │   ├── pages/           # Routed application views
│           │   │   ├── applications/# Job Application Tracker
│           │   │   ├── dashboard/   # User central dashboard & metrics
│           │   │   ├── document-editor/ # Live resume builder & preview engine
│           │   │   ├── documents/   # Resume collection management
│           │   │   ├── exports/     # Export history & files
│           │   │   ├── forgot-password/
│           │   │   ├── home/        # Landing page
│           │   │   ├── login/       # Authentication login
│           │   │   ├── profile/     # User profile settings
│           │   │   ├── reset-password/
│           │   │   ├── shares/      # Shared documents view
│           │   │   ├── signup/      # User registration
│           │   │   ├── templates/   # Template showcase & selection
│           │   │   └── testimonials/# User reviews & social proof
│           │   ├── shared/          # Header, Footer, Services, Interceptors & Common Styles
│           │   ├── app-routing.module.ts
│           │   ├── app.module.ts
│           │   └── material.module.ts
│           ├── assets/              # Images, icons, and static assets
│           ├── environments/        # Environment configurations
│           ├── styles.scss          # Global styling & theme variables
│           └── index.html           # Main HTML entrypoint
├── angular.json                     # Multi-project Angular workspace configuration
├── package.json                     # Dependencies and scripts
└── tsconfig.json                    # TypeScript compiler configuration
```

---
---

