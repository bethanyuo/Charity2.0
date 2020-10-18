import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { CharityRequestsComponent } from './components/charity-requests/charity-requests.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from 'src/shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RequestListComponent } from './components/home/request-list/request-list.component';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
//import { MatSortModule } from '@angular/material/sort';
import { RequestStateIconPipe } from './pipes/request-state-icon.pipe';
import { RequestStatePipe } from './pipes/request-state.pipe';
import { CharityInfoComponent } from './components/charity-info/charity-info.component';
import { RequestFormComponent } from './components/home/request-form/request-form.component';
import { HomeComponent } from './components/home/home.component';
//import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component';
import { DeliveryStateIconPipe } from './pipes/delivery-state-icon.pipe';
import { DeliveryStatePipe } from './pipes/delivery-state.pipe';
import { Web3Service } from './services/web3.service';
import { SearchComponent } from './components/search/search.component';
import { CharityComponent } from './components/search/charity/charity.component';
import { SupplierComponent } from './components/search/supplier/supplier.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    RequestListComponent,
    RequestStateIconPipe,
    RequestStatePipe,
    CharityInfoComponent,
    RequestFormComponent,
    HomeComponent,
    DeliveryStateIconPipe,
    DeliveryStatePipe,
    SearchComponent,
    CharityComponent,
    SupplierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule
  ],
  providers: [Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
