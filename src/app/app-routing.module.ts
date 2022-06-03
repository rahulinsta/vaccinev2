import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  {path: '', component: SignupComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'chart' , component: ChartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
