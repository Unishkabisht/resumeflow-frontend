import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { FeaturesPageComponent } from './pages/features/features.component';
import { TemplatesPageComponent } from './pages/templates/templates.component';
import { TestimonialsPageComponent } from './pages/testimonials/testimonials.component';
import { FaqPageComponent } from './pages/faq/faq.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { ExportsComponent } from './pages/exports/exports.component';
import { DocumentEditorComponent } from './pages/document-editor/document-editor.component';
import { SharesComponent } from './pages/shares/shares.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { AuthGuard } from 'projects/web/guards/auth.guard';
import { NoAuthGuard } from 'projects/web/guards/noauth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'features', component: FeaturesPageComponent },
  { path: 'templates', component: TemplatesPageComponent, canActivate: [AuthGuard] },
  { path: 'testimonials', component: TestimonialsPageComponent },
  { path: 'faq', component: FaqPageComponent },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },

  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [NoAuthGuard]
  },

  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NoAuthGuard]
  },

  {
    path: 'auth/reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [NoAuthGuard]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'documents/:id/edit',
    component: DocumentEditorComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'applications',
    component: ApplicationsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'exports',
    component: ExportsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'shares',
    component: SharesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
