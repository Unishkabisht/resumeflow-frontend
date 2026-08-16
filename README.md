# ResumeFlow 🚀

<div align="center">

![ResumeFlow Banner](https://img.shields.io/badge/ResumeFlow-AI--Powered%20Resume%20Builder-6366f1?style=for-the-badge&logo=angular&logoColor=white)

[![Angular](https://img.shields.io/badge/Angular-13.3-dd0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular Material](https://img.shields.io/badge/Angular_Material-13.3-ff4081?style=flat-square&logo=angular&logoColor=white)](https://material.angular.io/)
[![SCSS](https://img.shields.io/badge/Styles-SCSS-c69?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**A modern, intuitive, full-featured web application to design, manage, version, and export ATS-friendly resumes effortlessly.**

[Explore Features](#-key-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure)

</div>

---

## ✨ Overview

**ResumeFlow** is a dynamic resume-crafting suite built with Angular. Designed for professionals and job seekers, ResumeFlow enables real-time document editing, multi-template switching, version management, job application tracking, and high-fidelity client-side PDF/DOCX downloads with zero data loss.

---

## 🌟 Key Features

### 📄 Real-Time Document Editor
- **Interactive Live Preview**: Instant visual feedback as you type content, customize typography, reorder sections, and adjust spacing.
- **Section Management**: Add, remove, and reorganize standard and custom sections (Experience, Education, Skills, Projects, Certifications, etc.).
- **Dynamic Content Formatting**: Rich text and bullet-point itemization built for ATS readability.

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

### 📊 Job Application Tracker
- Integrated application pipeline to track target companies, job roles, interview stages, deadlines, and linked resumes.

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

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or newer recommended)
- [npm](https://www.npmjs.com/) (v8.x or newer)
- [Angular CLI](https://angular.io/cli) (v13.x)

```bash
npm install -g @angular/cli@13
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Unishkabisht/resumeflow-frontend.git
   cd resumeflow-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment:**
   Update API endpoint URLs in `projects/web/src/environments/environment.ts` (defaults to `http://localhost:5000`):
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000'
   };
   ```

4. **Run the Development Server:**
   ```bash
   npm run start:web
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:4200/` in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run start:web` | Starts the Angular dev server for the **web** application project |
| `npm run build` | Compiles and builds the production bundles in `dist/` |
| `npm run watch` | Builds the project in development mode with continuous file watching |
| `npm test` | Runs unit tests via Karma and Jasmine |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Crafted with ❤️ by <a href="https://github.com/Unishkabisht">Unishka Bisht</a>
</div>
