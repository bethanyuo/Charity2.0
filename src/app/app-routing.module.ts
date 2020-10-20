import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractorHomeComponent } from './components/contractor-home/contractor-home.component';
//import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'}, 
  { path: 'home', component: HomeComponent }, 
  { path: 'search', component: SearchComponent }, 
  { path: 'contractor', component: ContractorHomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
