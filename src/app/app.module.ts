import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroComponent } from './components/hero/hero.component';
import { DashboardNavComponent } from './projects/web/src/app/shared/components/dashboard-nav/dashboard-nav.component';
import { ApplicationsComponent } from './projects/web/src/app/pages/applications/applications.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    DashboardNavComponent,
    ApplicationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
