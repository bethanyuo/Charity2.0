import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CharityRequestsComponent } from './components/charity-requests/charity-requests.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from 'src/shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RequestListComponent } from './components/request-list/request-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CharityRequestsComponent,
    FooterComponent,
    NavbarComponent,
    RequestListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
