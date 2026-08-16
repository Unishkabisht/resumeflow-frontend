import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material.module';
import { HomeComponent } from './pages/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { StatsComponent } from './components/stats/stats.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { FeaturesComponent } from './components/features/features.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CtaBandComponent } from './components/cta-band/cta-band.component';
import { FaqComponent } from './components/faq/faq.component';
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
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeroComponent,
    StatsComponent,
    HowItWorksComponent,
    FeaturesComponent,
    TemplatesComponent,
    TestimonialsComponent,
    CtaBandComponent,
    FaqComponent,
    FeaturesPageComponent,
    TemplatesPageComponent,
    TestimonialsPageComponent,
    FaqPageComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    DocumentsComponent,
    ApplicationsComponent,
    ExportsComponent,
    DocumentEditorComponent,
    SharesComponent,
    ProfileComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
